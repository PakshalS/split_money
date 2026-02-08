import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { tourSteps } from '../config/tourSteps';
import apiClient from '../api/client';

const TourContext = createContext();

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};

export const TourProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const driverObjRef = useRef(null);
  const stepIndexRef = useRef(0);
  const isNavigatingRef = useRef(false);
  const pendingTourRef = useRef(false);
  const waitingForNavigationRef = useRef(false);
  const previousPathRef = useRef(location.pathname);
  const completedTourRef = useRef(false);

  // Dynamic element finder that picks visible elements
  const findVisibleElement = useCallback((selector) => {
    // Handle :last-child selector for expense items
    if (selector.includes(':last-child')) {
      // For last-child selectors, get all matching elements and return the last one
      const baseSelector = selector.replace(':last-child', '');
      const elements = document.querySelectorAll(baseSelector);
      if (elements.length > 0) {
        const lastElement = elements[elements.length - 1];
        // Scroll into view if needed
        lastElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return lastElement;
      }
    }
    
    const elements = document.querySelectorAll(selector);
    
    // Try to find a visible element first
    for (let i = 0; i < elements.length; i++) {
      const rect = elements[i].getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        return elements[i];
      }
    }
    
    // If no visible elements, scroll the first one into view and return it
    if (elements.length > 0) {
      elements[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      return elements[0];
    }
    
    // If no elements found at all, return the selector as fallback for Driver.js
    console.warn(`Element not found: ${selector}`);
    return selector;
  }, []);

  // Handle interactive steps with auto-advance
  const handleInteractiveStep = useCallback((element, stepConfig, driverInstance) => {
    if (!stepConfig.requireInteraction) return;

    const delay = stepConfig.element?.includes('dropdown-add-guest-option') ||
                  stepConfig.element?.includes('guest-modal-done-button') ||
                  stepConfig.element?.includes('create-group-send-button') ||
                  stepConfig.element?.includes('action-menu-add-expense') ||
                  stepConfig.element?.includes('settle-up-action-button') ||
                  stepConfig.element?.includes('expense-next-button')
                  ? 1000 : 300;

    const advanceStep = () => {
      // If this step expects navigation, don't advance immediately - wait for route change
      if (stepConfig.waitForNavigation) {
        waitingForNavigationRef.current = true;
        previousPathRef.current = location.pathname;
      } else {
        // No navigation expected, advance normally after delay
        setTimeout(() => {
          if (driverInstance && driverInstance.hasNextStep && driverInstance.hasNextStep()) {
            stepIndexRef.current = stepIndexRef.current + 1;
            setCurrentStepIndex(stepIndexRef.current);
            driverInstance.moveNext();
          }
        }, delay);
      }
    };

    switch (stepConfig.action) {
      case 'click':
        element.addEventListener('click', advanceStep, { once: true });
        break;
      
      case 'input':
        // If placeholder is provided, auto-advance immediately (field is pre-filled)
        if (stepConfig.placeholder && element.value.trim()) {
          advanceStep();
        } else {
          // No placeholder, wait for user input
          const handleInput = () => {
            if (element.value.trim()) {
              element.removeEventListener('input', handleInput);
              advanceStep();
            }
          };
          element.addEventListener('input', handleInput);
        }
        break;
    }
  }, [location.pathname]);

  // Initialize tour (called after navigation is complete)
  const initializeTour = useCallback(() => {
    if (driverObjRef.current) {
      driverObjRef.current.destroy();
    }

    setIsTourActive(true);
    stepIndexRef.current = 0;
    setCurrentStepIndex(0);
    completedTourRef.current = false;
    const lastStepIndex = tourSteps.length - 1;

    const driverInstance = driver({
      showProgress: true,
      showButtons: ['close'],
      allowClose: true,
      steps: tourSteps.map((step, index) => ({
        element: typeof step.element === 'string' && step.element !== 'body'
          ? () => findVisibleElement(step.element)
          : step.element,
        popover: {
          ...step.popover,
          // Use step's showButtons if defined, otherwise: Step 0 gets next + close, all others get just close
          showButtons: step.popover?.showButtons || (index === 0 ? ['next', 'close'] : ['close']),
          onNextClick: () => {
            stepIndexRef.current = index + 1;
            setCurrentStepIndex(index + 1);
            driverInstance.moveNext();
          },
        },
        onHighlighted: (element) => {
          const stepConfig = tourSteps[index];

          if (index === lastStepIndex) {
            completedTourRef.current = true;
          }

          // Handle delay before showing this step (gives API time to complete)
          if (stepConfig.delay && element && element !== 'body') {
            // Disable interaction during delay
            return setTimeout(() => {
              handleInteractiveStep(element, stepConfig, driverInstance);
            }, stepConfig.delay);
          }
          
          // Auto-populate inputs if placeholder is provided
          if (stepConfig.action === 'input' && stepConfig.placeholder && element) {
            // Set the value using the native setter to trigger React's onChange
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
              window.HTMLInputElement.prototype,
              'value'
            ).set;
            nativeInputValueSetter.call(element, stepConfig.placeholder);
            
            // Dispatch both input and change events for React compatibility
            const inputEvent = new Event('input', { bubbles: true });
            const changeEvent = new Event('change', { bubbles: true });
            element.dispatchEvent(inputEvent);
            element.dispatchEvent(changeEvent);
          }

          // Handle interactive steps
          handleInteractiveStep(element, stepConfig, driverInstance);
        },
      })),
      onDestroyStarted: async () => {
        setIsTourActive(false);
        
        // Update backend with tour completion status
        try {
          const tourStatus = completedTourRef.current ? "done" : "later";
          await apiClient.patch('/auth/tour-status', { tourStatus });
        } catch (error) {
          console.error('Failed to update tour status:', error);
        }

        if (driverInstance) {
          driverInstance.destroy();
        }
        driverObjRef.current = null;
      },
    });

    driverObjRef.current = driverInstance;
    driverInstance.drive();
  }, [findVisibleElement, handleInteractiveStep]);

  // Start tour (handles navigation if needed)
  const startTour = useCallback(() => {
    // Check if we're on the home page
    if (location.pathname !== '/home') {
      // Navigate to home first
      pendingTourRef.current = true;
      navigate('/home');
    } else {
      // Already on home, start tour immediately with a small delay
      setTimeout(() => {
        initializeTour();
      }, 300);
    }
  }, [location.pathname, navigate, initializeTour]);

  // Watch for navigation completion when tour is pending
  useEffect(() => {
    if (pendingTourRef.current && location.pathname === '/home') {
      pendingTourRef.current = false;
      // Wait for page to render
      setTimeout(() => {
        initializeTour();
      }, 500);
    }
  }, [location.pathname, initializeTour]);

  // Watch for navigation changes during tour (for steps with waitForNavigation)
  useEffect(() => {
    if (isTourActive && location.pathname !== previousPathRef.current) {
      previousPathRef.current = location.pathname;
      
      // If we were waiting for navigation, now advance the tour
      if (waitingForNavigationRef.current) {
        waitingForNavigationRef.current = false;
        
        // Wait for new page to render, then advance tour
        setTimeout(() => {
          if (driverObjRef.current && driverObjRef.current.hasNextStep()) {
            stepIndexRef.current = stepIndexRef.current + 1;
            setCurrentStepIndex(stepIndexRef.current);
            driverObjRef.current.moveNext();
          }
        }, 800);
      } else {
        // Just a route change without waiting - refresh current step to show on new page
        setTimeout(() => {
          if (driverObjRef.current) {
            const currentDriver = driverObjRef.current;
            if (currentDriver.refresh) {
              currentDriver.refresh();
            }
          }
        }, 500);
      }
    }
  }, [location.pathname, isTourActive]);

  // Stop tour
  const stopTour = useCallback(() => {
    if (driverObjRef.current) {
      driverObjRef.current.destroy();
      driverObjRef.current = null;
    }
    setIsTourActive(false);
    setCurrentStepIndex(0);
    stepIndexRef.current = 0;
  }, []);

  // Start tour from a specific step (for debugging)
  const startTourFromStep = useCallback((stepNumber) => {
    if (driverObjRef.current) {
      driverObjRef.current.destroy();
    }

    setIsTourActive(true);
    stepIndexRef.current = stepNumber;
    setCurrentStepIndex(stepNumber);

    const driverInstance = driver({
      showProgress: true,
      showButtons: ['close'],
      allowClose: true,
      steps: tourSteps.map((step, index) => ({
        element: typeof step.element === 'string' && step.element !== 'body'
          ? () => findVisibleElement(step.element)
          : step.element,
        popover: {
          ...step.popover,
          showButtons: step.popover?.showButtons || (index === 0 ? ['next', 'close'] : ['close']),
          onNextClick: () => {
            stepIndexRef.current = index + 1;
            setCurrentStepIndex(index + 1);
            driverInstance.moveNext();
          },
        },
        onHighlighted: (element) => {
          const stepConfig = tourSteps[index];
          
          if (stepConfig.action === 'input' && stepConfig.placeholder && element) {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
              window.HTMLInputElement.prototype,
              'value'
            ).set;
            nativeInputValueSetter.call(element, stepConfig.placeholder);
            
            const inputEvent = new Event('input', { bubbles: true });
            const changeEvent = new Event('change', { bubbles: true });
            element.dispatchEvent(inputEvent);
            element.dispatchEvent(changeEvent);
          }

          handleInteractiveStep(element, stepConfig, driverInstance);
        },
      })),
      onDestroyStarted: async () => {
        setIsTourActive(false);
        if (driverInstance) {
          driverInstance.destroy();
        }
        driverObjRef.current = null;
      },
    });

    driverObjRef.current = driverInstance;
    driverInstance.drive(stepNumber);
  }, [findVisibleElement, handleInteractiveStep]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (driverObjRef.current) {
        driverObjRef.current.destroy();
      }
    };
  }, []);

  const value = {
    isTourActive,
    currentStepIndex,
    startTour,
    stopTour,
    startTourFromStep,
  };

  return (
    <TourContext.Provider value={value}>
      {children}
    </TourContext.Provider>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import './ButtonColorAssignment.css';

const ButtonColorAssignment = () => {
  // Enhanced color palette with vibrant, distinct colors
  const colors = [
    '#FF5252', // Red
    '#FF9800', // Orange 
    '#FFEB3B', // Yellow
    '#4CAF50', // Green
    '#2196F3', // Blue
    '#673AB7', // Purple
    '#F06292', // Pink
    '#00BCD4', // Cyan
    '#795548'  // Brown
  ];
  
  // State for buttons
  const [buttons, setButtons] = useState(
    Array(9).fill().map((_, i) => ({ 
      id: i, 
      color: 'white', 
      disabled: false 
    }))
  );
  
  // Current color index to assign
  const [colorIndex, setColorIndex] = useState(0);
  
  // History for undo functionality
  const [history, setHistory] = useState([]);
  
  // Add timer functionality
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef(null);
  
  // Currently focused button (for keyboard navigation)
  const [focusedButton, setFocusedButton] = useState(0);
  
  // Start timer on first click
  useEffect(() => {
    let interval = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
      intervalRef.current = interval;
    } else if (!isActive && timer !== 0) {
      clearInterval(intervalRef.current);
    }
    
    return () => clearInterval(interval);
  }, [isActive, timer]);
  
  useEffect(() => {
    if (colorIndex === 1 && !isActive) {
      setIsActive(true);
    }
    
    if (colorIndex === colors.length && isActive) {
      setIsActive(false);
    }
  }, [colorIndex, colors.length, isActive]);
  
  // Format time as MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (colorIndex >= colors.length) return;
      
      switch (e.key) {
        case 'ArrowRight':
          setFocusedButton(prev => (prev + 1) % 9);
          break;
        case 'ArrowLeft':
          setFocusedButton(prev => (prev - 1 + 9) % 9);
          break;
        case 'ArrowUp':
          setFocusedButton(prev => (prev - 3 + 9) % 9);
          break;
        case 'ArrowDown':
          setFocusedButton(prev => (prev + 3) % 9);
          break;
        case 'Enter':
        case ' ': // Space
          const buttonToClick = buttons[focusedButton];
          if (!buttonToClick.disabled) {
            handleButtonClick(buttonToClick.id);
          }
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [buttons, colorIndex, colors.length, focusedButton]);
  
  // Assign the next color in sequence to the clicked button
  const handleButtonClick = (buttonId) => {
    // Check if we still have colors to assign
    if (colorIndex >= colors.length) return;
    
    // Save current state to history for undo
    setHistory(prev => [...prev, JSON.parse(JSON.stringify(buttons))]);
    
    // Get the next color in the sequence
    const nextColor = colors[colorIndex];
    
    // Update the button's color and disable it
    setButtons(prev => prev.map(btn => 
      btn.id === buttonId 
        ? { 
            ...btn, 
            color: nextColor, 
            disabled: true,
            justAssigned: true
          } 
        : { 
            ...btn, 
            justAssigned: false 
          }
    ));
    
    setColorIndex(prev => prev + 1);

    setTimeout(() => {
      setButtons(prev => prev.map(btn => ({
        ...btn,
        justAssigned: false
      })));
    }, 500);
  };
  

  const handleUndo = () => {
    if (history.length === 0) return;
    

    const lastState = history[history.length - 1];
    
   
    setButtons(lastState);
    
    
    setHistory(prev => prev.slice(0, -1));
    
    
    setColorIndex(prev => prev - 1);
  };
  
  
  const resetAll = () => {
    setButtons(Array(9).fill().map((_, i) => ({ 
      id: i, 
      color: 'white', 
      disabled: false,
      justAssigned: false
    })));
    setColorIndex(0);
    setHistory([]);
    setTimer(0);
    setIsActive(false);
    clearInterval(intervalRef.current);
  };

  return (
    <div className="color-assigner">
      <h2>Interactive Button Color Assignment</h2>
      
      <div className="control-panel">
        <div className="timer-display">
          <span className="timer-label">Time</span>
          <span className="timer-value">{formatTime(timer)}</span>
        </div>
        
        <div className="next-color-display">
          <span>Next color</span>
          <div 
            className="next-color-preview" 
            style={{ 
              backgroundColor: colorIndex < colors.length ? colors[colorIndex] : 'gray',
              boxShadow: colorIndex < colors.length 
                ? `0 0 10px ${colors[colorIndex]}` 
                : 'none'
            }}
          ></div>
        </div>
        
        <div className="completion-status">
          <span>{colorIndex}/{colors.length}</span>
        </div>
      </div>
      
      {/* Progress indicator */}
      <div className="progress-container">
        <div 
          className="progress-bar" 
          style={{ width: `${(colorIndex / colors.length) * 100}%` }} 
        />
      </div>
      
      {/* Instructions */}
      <p className="instructions">
        Click any button to assign the next color in sequence.
        <br/>
        <small>Tip: Use arrow keys to navigate and Enter to select</small>
      </p>
      
      {/* Button grid */}
      <div className="button-grid" role="grid" aria-label="Color assignment grid">
        {buttons.map(btn => (
          <button
            key={btn.id}
            ref={btn.id === focusedButton ? (el) => el && el.focus() : null}
            className={`color-btn ${btn.disabled ? 'disabled' : ''} ${btn.justAssigned ? 'just-assigned' : ''} ${btn.id === focusedButton ? 'focused' : ''}`}
            onClick={() => handleButtonClick(btn.id)}
            disabled={btn.disabled}
            style={{ 
              backgroundColor: btn.color,
              border: btn.id === focusedButton ? '3px dashed black' : btn.disabled ? 'none' : '2px solid black'
            }}
            aria-label={`Button ${btn.id + 1}${btn.disabled ? ', color assigned' : ', click to assign color'}`}
          >
            {btn.id + 1}
          </button>
        ))}
      </div>
      
      {/* Action buttons */}
      <div className="action-buttons">
        <button 
          className="undo-btn"
          onClick={handleUndo}
          disabled={history.length === 0}
          aria-label="Undo last color assignment"
        >
          ↩ Undo
        </button>
        
        <button 
          className="reset-btn"
          onClick={resetAll}
          aria-label="Reset all buttons"
        >
          ⟳ Reset All
        </button>
      </div>
      
      {/* Completion message */}
      {colorIndex === colors.length && (
        <div className="completion-container">
          <p className="completion-msg">All colors have been assigned!</p>
          <p className="completion-time">Completion time: {formatTime(timer)}</p>
        </div>
      )}
    </div>
  );
};

export default ButtonColorAssignment;
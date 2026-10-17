import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import './BudgetSelect.css';

const LIST_OFFSET = 16;
const LIST_MAX_HEIGHT = 300;
const VIEWPORT_MARGIN = 16;

// Dropdown for the budget form (category and theme). The list is portaled to
// <body> so the modal's scroll container doesn't clip it. Focus stays on the
// trigger and the highlighted option is announced through
// aria-activedescendant, which keeps keyboard focus inside the modal's focus trap.
const BudgetSelect = ({
  id,
  labelId,
  value,
  options,
  disabledValues = [],
  disabledHint = 'Already used',
  disabled = false,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [position, setPosition] = useState(null);
  const triggerRef = useRef(null);
  const listRef = useRef(null);

  const listId = `${id}-listbox`;
  const optionId = (index) => `${id}-option-${index}`;
  const isDisabled = (option) => disabledValues.includes(option.value);
  const selected = options.find(option => option.value === value);

  const updatePosition = () => {
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - LIST_OFFSET - VIEWPORT_MARGIN;
    const spaceAbove = rect.top - LIST_OFFSET - VIEWPORT_MARGIN;
    const openUp = spaceBelow < LIST_MAX_HEIGHT && spaceAbove > spaceBelow;
    const maxHeight = Math.min(LIST_MAX_HEIGHT, openUp ? spaceAbove : spaceBelow);

    setPosition({
      left: rect.left,
      width: rect.width,
      maxHeight,
      ...(openUp
        ? { bottom: window.innerHeight - rect.top + LIST_OFFSET }
        : { top: rect.bottom + LIST_OFFSET })
    });
  };

  const open = () => {
    if (disabled) return;
    const selectedIndex = options.findIndex(option => option.value === value);
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : options.findIndex(option => !isDisabled(option)));
    updatePosition();
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const select = (option) => {
    if (isDisabled(option)) return;
    onChange(option.value);
    close();
  };

  // Next selectable option in the given direction, skipping disabled ones
  const findSelectable = (from, step) => {
    for (let i = from + step; i >= 0 && i < options.length; i += step) {
      if (!isDisabled(options[i])) return i;
    }
    return from;
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (!triggerRef.current.contains(e.target) && !listRef.current?.contains(e.target)) {
        close();
      }
    };
    const handleViewportChange = (e) => {
      // Scrolling inside the list itself shouldn't close it
      if (e.type === 'scroll' && listRef.current?.contains(e.target)) return;
      close();
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Keep the highlighted option visible while moving with the arrow keys
  useLayoutEffect(() => {
    if (!isOpen || activeIndex < 0) return;
    const option = document.getElementById(optionId(activeIndex));
    option?.scrollIntoView?.({ block: 'nearest' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeIndex]);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          open();
        } else {
          setActiveIndex(index => findSelectable(index, e.key === 'ArrowDown' ? 1 : -1));
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isOpen) {
          open();
        } else if (activeIndex >= 0) {
          select(options[activeIndex]);
        }
        break;
      case 'Escape':
        if (isOpen) {
          // Close only the list, not the surrounding modal
          e.stopPropagation();
          close();
        }
        break;
      case 'Tab':
        if (isOpen) close();
        break;
      default:
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        className="budget-select__trigger"
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-labelledby={labelId ? `${labelId} ${id}` : undefined}
        aria-activedescendant={isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined}
      >
        {selected?.color && (
          <span
            className="budget-select__tag"
            style={{ backgroundColor: selected.color }}
            aria-hidden="true"
          />
        )}
        <span className="budget-select__value">{selected ? selected.label : ''}</span>
      </button>

      {isOpen && position && createPortal(
        <ul
          ref={listRef}
          id={listId}
          className="budget-select__list"
          role="listbox"
          aria-labelledby={labelId}
          style={position}
          // Keep focus on the trigger when an option is clicked
          onMouseDown={(e) => e.preventDefault()}
        >
          {options.map((option, index) => {
            const optionDisabled = isDisabled(option);
            return (
              <li
                key={option.value}
                id={optionId(index)}
                className={[
                  'budget-select__option',
                  optionDisabled && 'budget-select__option--disabled',
                  index === activeIndex && 'budget-select__option--active'
                ].filter(Boolean).join(' ')}
                role="option"
                aria-selected={option.value === value}
                aria-disabled={optionDisabled}
                onClick={() => select(option)}
                onMouseEnter={() => !optionDisabled && setActiveIndex(index)}
              >
                {option.color && (
                  <span
                    className="budget-select__tag"
                    style={{ backgroundColor: option.color }}
                    aria-hidden="true"
                  />
                )}
                <span className="budget-select__label">{option.label}</span>
                {optionDisabled && disabledHint && (
                  <span className="budget-select__hint">{disabledHint}</span>
                )}
              </li>
            );
          })}
        </ul>,
        document.body
      )}
    </>
  );
};

BudgetSelect.propTypes = {
  id: PropTypes.string.isRequired,
  labelId: PropTypes.string,
  value: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      color: PropTypes.string
    })
  ).isRequired,
  disabledValues: PropTypes.arrayOf(PropTypes.string),
  disabledHint: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired
};

export default BudgetSelect;

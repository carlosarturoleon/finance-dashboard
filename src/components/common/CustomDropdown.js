import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import "./CustomDropdown.css";

const CustomDropdown = ({
  value,
  onChange,
  options,
  placeholder,
  label,
  CaretIcon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  // Add keyboard handling
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === "ArrowDown" && isOpen) {
      // Focus on first option
      const firstOption = dropdownRef.current.querySelector(".dropdown__item");
      if (firstOption) firstOption.focus();
    }
  };

  const handleItemKeyDown = (e, optionValue) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOptionClick(optionValue);
    }
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      <div className="dropdown__container">
        {label && <span className="dropdown__label">{label}</span>}
        <div className="dropdown__wrapper">
          <div
            className="dropdown__selected"
            onClick={() => setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <span>{selectedOption ? selectedOption.label : placeholder}</span>
            {CaretIcon && <CaretIcon aria-hidden="true" />}
          </div>

          <div
            className={`dropdown__menu ${
              isOpen ? "dropdown__menu--active" : ""
            }`}
            role="listbox"
          >
            {options.map((option) => (
              <div
                key={option.value}
                className={`dropdown__item ${
                  value === option.value ? "dropdown__item--selected" : ""
                }`}
                onClick={() => handleOptionClick(option.value)}
                onKeyDown={(e) => handleItemKeyDown(e, option.value)}
                role="option"
                aria-selected={value === option.value}
                tabIndex={isOpen ? 0 : -1}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

CustomDropdown.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  CaretIcon: PropTypes.elementType,
};

export default CustomDropdown;

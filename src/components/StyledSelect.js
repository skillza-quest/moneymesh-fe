import React from 'react';
import styled from 'styled-components';

const SelectContainer = styled.div`
    position: relative;
    display: inline-block;
    background-color: ${props => getBgColor(props.value)};
    border-radius: 15px;
    padding: 6px 30px 6px 12px; // Space for the arrow

    &::after {
        content: url('data:image/svg+xml;utf8,<svg fill="%23000000" height="16" width="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"></path></svg>');
        position: absolute;
        top: 55%;
        right: 12px;
        transform: translateY(-50%);
        color: ${props => getTextColor(props.value)};
        pointer-events: none;
    }
`;

const StyledSelect = styled.select`
    appearance: none;
    border-radius: 15px;
    border: none;
    font-size: 12px;
    font-family: 'Manrope-Bold';
    background-color: transparent;
    color: ${props => getTextColor(props.value)};
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
    position: relative;

    &:hover {
        opacity: 0.8;
    }

    &:focus {
        outline: none;
        box-shadow: none;
    }
`;

function getBgColor(value) {
    switch (value) {
        case 'New': return '#ECFDF3';
        case 'Rejected': return '#FDF2FA';
        default: return '#EEF4FF';
    }
}

function getTextColor(value) {
    switch (value) {
        case 'New': return '#027A48';
        case 'Rejected': return '#C11574';
        default: return '#3538CD';
    }
}

const CustomDropdown = (props) => {
    return (
        <SelectContainer value={props.value}>
            <StyledSelect {...props}>
                {props.children}
            </StyledSelect>
        </SelectContainer>
    );
}

export default CustomDropdown;

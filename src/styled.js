import styled from 'styled-components'

export const SelectStyled = styled.select`
  font: 400 14px 'Roboto', sans-serif;
  font-style: ${p => (p.isPlaceholder ? 'italic' : 'normal')};
  background: #454958;
  color: ${p => (p.isPlaceholder ? 'rgb(255, 255, 255, 0.5)' : '#fff')};
  border: 1px solid #1b1c21;
  border-radius: 4px;
  width: 100%;
  height: 32px;
  box-sizing: border-box;
  outline: none;
`

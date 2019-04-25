import styled from 'styled-components'

const Label = styled.span`
  display: flex;
  align-items: center;
  svg {
    margin-right: .5rem;
  }
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  user-select: none;
  box-sizing: border-box;
`

export default Label

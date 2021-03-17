import { Chance } from 'chance';
import { within, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const generateBoolean = () => Chance().pickone([true, false]);

export const undefinedOr = (fn: Function) =>
  Chance().pickone([undefined, fn()]);

export const generateArrayOf = (fn: Function, numberOf: number = 3) =>
  Array.from(new Array(numberOf), () => fn());

// react-select (used by @grafana/ui) renders very differently from the native Select HTML element
// and because they are not accessible and do not pass data-testid or aria-labels down,
// it is difficult to grab the correct element and simulate selecting different options
// the helper functions below can be used instead

/**
 * Opens a Select or MultiSelect dropdown
 *
 * @param {HTMLElement} container The container wrapping the Select or MultiSelect component
 */
export const openSelect = (container: HTMLElement) => {
  const selectInput = within(container).getByRole('textbox');

  // this needs to be here to support autoFocus=true prop
  fireEvent.blur(selectInput);

  // open the dropdown
  userEvent.type(selectInput, '{arrowdown}');
};

/**
 * Selects an option from the Select or MultiSelect component
 *
 * @param {HTMLElement} container The container wrapping the Select or MultiSelect component
 * @param {string} optionLabel The option we want to select
 * @param {boolean} [typeOptionLabel=false] If we should type the optional label after opening - this is useful for AsyncSelect
 */
export const selectOption = async (
  container: HTMLElement,
  optionLabel: string,
  typeOptionLabel?: boolean
) => {
  openSelect(container);

  // if we have an async Select and we want to type the option label to display it
  if (typeOptionLabel) {
    const selectInput = within(container).getByRole('textbox');
    userEvent.type(selectInput, optionLabel);
  }

  // wait for the list to show
  const option = await waitFor(() => within(container).getByText(optionLabel));

  // select the option
  userEvent.click(option);
};

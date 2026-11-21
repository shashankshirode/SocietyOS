import React from 'react';
import { Keyboard, Text, TextInput, View } from 'react-native';
import { fireEvent, cleanup, act, screen } from '@testing-library/react-native';
import { KeyboardExperienceProvider, useKeyboardExperience } from '../../../modules/resident/experience/KeyboardExperienceContext';
import { KeyboardFocusContext, useKeyboardFocus, type KeyboardFocusCoordinator } from '../KeyboardFocusContext';
import { KeyboardAwareScrollView } from '../KeyboardAwareScrollView';
import { KeyboardAwareForm } from '../../forms/KeyboardAwareForm';
import { AppTextInput } from '../../../ui/forms/AppTextInput';
import { AppTextArea } from '../../../ui/forms/AppTextArea';
import { AppTextField } from '../../../ui/forms/AppTextField';
import { FormField } from '../../forms/FormField';
import { SocietyInput } from '../../components/SocietyInput';
import { SearchInputBar } from '../../components/SearchInputBar';
import { renderWithProviders } from '../../../test/testUtils';

jest.mock('../../../core/theme/useThemePreference', () => ({
  useThemePreference: () => ({
    preference: 'light',
    setPreference: jest.fn(),
    isLoading: false,
  }),
}));

function KeyboardStatusDisplay() {
  const keyboard = useKeyboardExperience();
  return (
    <View>
      <Text testID="kb-status">{keyboard.isOpen ? 'OPEN' : 'CLOSED'}</Text>
      <Text testID="kb-height">{keyboard.keyboardHeight}</Text>
      <Text testID="kb-inset">{keyboard.keyboardInset}</Text>
    </View>
  );
}

describe('KeyboardAvoidanceAndFocus Suite', () => {
  it('KeyboardExperienceContext tracks keyboard events', async () => {
    let showHandler: ((event: any) => void) | null = null;
    let hideHandler: (() => void) | null = null;

    const addListenerSpy = jest.spyOn(Keyboard, 'addListener').mockImplementation(((event: string, cb: any) => {
      if (event === 'keyboardDidShow') {
        showHandler = cb;
      }
      if (event === 'keyboardDidHide') {
        hideHandler = cb;
      }
      return { remove: jest.fn() };
    }) as any);

    await renderWithProviders(
      <KeyboardExperienceProvider>
        <KeyboardStatusDisplay />
      </KeyboardExperienceProvider>
    );

    expect(screen.getByTestId('kb-status').props.children).toBe('CLOSED');
    expect(screen.getByTestId('kb-height').props.children).toBe(0);

    expect(showHandler).toBeTruthy();
    await act(async () => {
      (showHandler as any)({
        endCoordinates: { height: 280, screenY: 520, width: 390 },
        duration: 250,
      });
    });

    expect(screen.getByTestId('kb-status').props.children).toBe('OPEN');
    expect(screen.getByTestId('kb-height').props.children).toBe(280);

    expect(hideHandler).toBeTruthy();
    await act(async () => {
      (hideHandler as any)();
    });

    expect(screen.getByTestId('kb-status').props.children).toBe('CLOSED');
    expect(screen.getByTestId('kb-height').props.children).toBe(0);

    addListenerSpy.mockRestore();
  });

  it('notifies focus coordinator on input focus and blur', async () => {
    const registerMock = jest.fn();
    const unregisterMock = jest.fn();

    const coordinator: KeyboardFocusCoordinator = {
      registerFocusedInput: registerMock,
      unregisterFocusedInput: unregisterMock,
      ensureVisible: jest.fn(),
    };

    function Consumer() {
      const { registerFocusedInput, unregisterFocusedInput } = useKeyboardFocus();
      return (
        <TextInput
          testID="test-input"
          onFocus={() => registerFocusedInput({} as any)}
          onBlur={() => unregisterFocusedInput({} as any)}
        />
      );
    }

    await renderWithProviders(
      <KeyboardFocusContext.Provider value={coordinator}>
        <Consumer />
      </KeyboardFocusContext.Provider>
    );

    const input = screen.getByTestId('test-input');
    await act(async () => {
      fireEvent(input, 'focus');
    });
    expect(registerMock).toHaveBeenCalled();

    await act(async () => {
      fireEvent(input, 'blur');
    });
    expect(unregisterMock).toHaveBeenCalled();
  });

  it('renders KeyboardAwareScrollView with content', async () => {
    await renderWithProviders(
      <KeyboardAwareScrollView testID="aware-scroll">
        <Text>Scrollable Content</Text>
      </KeyboardAwareScrollView>
    );

    expect(screen.getByTestId('aware-scroll')).toBeTruthy();
    expect(screen.getByText('Scrollable Content')).toBeTruthy();
  });

  it('renders KeyboardAwareForm with command footer', async () => {
    await renderWithProviders(
      <KeyboardAwareForm
        testID="aware-form"
        command={<Text testID="cmd-btn">Save</Text>}
      >
        <Text>Form Body</Text>
      </KeyboardAwareForm>
    );

    expect(screen.getByTestId('aware-form')).toBeTruthy();
    expect(screen.getByText('Form Body')).toBeTruthy();
    expect(screen.getByTestId('cmd-btn')).toBeTruthy();
  });

  it('AppTextInput highlights and registers with coordinator', async () => {
    const registerMock = jest.fn();
    const unregisterMock = jest.fn();
    const coordinator: KeyboardFocusCoordinator = {
      registerFocusedInput: registerMock,
      unregisterFocusedInput: unregisterMock,
      ensureVisible: jest.fn(),
    };

    await renderWithProviders(
      <KeyboardFocusContext.Provider value={coordinator}>
        <AppTextInput
          testID="app-text-input"
          value=""
          onChangeText={jest.fn()}
          placeholder="Enter name"
        />
      </KeyboardFocusContext.Provider>
    );

    const input = screen.getByTestId('app-text-input');
    expect(input.props.cursorColor).toBe('#064F43');
    expect(input.props.selectionColor).toBe('#064F43');

    await act(async () => {
      fireEvent(input, 'focus');
    });
    expect(registerMock).toHaveBeenCalled();

    await act(async () => {
      fireEvent(input, 'blur');
    });
    expect(unregisterMock).toHaveBeenCalled();
  });

  it('AppTextArea notifies coordinator on focus, blur, and resize', async () => {
    const registerMock = jest.fn();
    const unregisterMock = jest.fn();
    const ensureVisibleMock = jest.fn();
    const coordinator: KeyboardFocusCoordinator = {
      registerFocusedInput: registerMock,
      unregisterFocusedInput: unregisterMock,
      ensureVisible: ensureVisibleMock,
    };

    await renderWithProviders(
      <KeyboardFocusContext.Provider value={coordinator}>
        <AppTextArea
          testID="app-text-area"
          value=""
          onChangeText={jest.fn()}
          placeholder="Enter comments"
        />
      </KeyboardFocusContext.Provider>
    );

    const textarea = screen.getByTestId('app-text-area');
    expect(textarea.props.cursorColor).toBe('#064F43');

    await act(async () => {
      fireEvent(textarea, 'focus');
    });
    expect(registerMock).toHaveBeenCalled();

    await act(async () => {
      fireEvent(textarea, 'contentSizeChange', {
        nativeEvent: { contentSize: { height: 160 } },
      });
    });
    expect(ensureVisibleMock).toHaveBeenCalled();

    await act(async () => {
      fireEvent(textarea, 'blur');
    });
    expect(unregisterMock).toHaveBeenCalled();
  });

  it('AppTextField notifies coordinator on focus and blur', async () => {
    const registerMock = jest.fn();
    const unregisterMock = jest.fn();
    const coordinator: KeyboardFocusCoordinator = {
      registerFocusedInput: registerMock,
      unregisterFocusedInput: unregisterMock,
      ensureVisible: jest.fn(),
    };

    await renderWithProviders(
      <KeyboardFocusContext.Provider value={coordinator}>
        <AppTextField
          label="Email"
          placeholder="user@example.com"
          testID="app-text-field"
        />
      </KeyboardFocusContext.Provider>
    );

    const input = screen.getByTestId('app-text-field');
    expect(input.props.cursorColor).toBe('#064F43');

    await act(async () => {
      fireEvent(input, 'focus');
    });
    expect(registerMock).toHaveBeenCalled();

    await act(async () => {
      fireEvent(input, 'blur');
    });
    expect(unregisterMock).toHaveBeenCalled();
  });

  it('FormField notifies coordinator and highlights on focus', async () => {
    const registerMock = jest.fn();
    const unregisterMock = jest.fn();
    const coordinator: KeyboardFocusCoordinator = {
      registerFocusedInput: registerMock,
      unregisterFocusedInput: unregisterMock,
      ensureVisible: jest.fn(),
    };

    await renderWithProviders(
      <KeyboardFocusContext.Provider value={coordinator}>
        <FormField
          label="Flat Number"
          value="A-101"
          onChangeText={jest.fn()}
          testID="form-field-input"
        />
      </KeyboardFocusContext.Provider>
    );

    const input = screen.getByTestId('form-field-input');
    expect(input.props.cursorColor).toBe('#064F43');

    await act(async () => {
      fireEvent(input, 'focus');
    });
    expect(registerMock).toHaveBeenCalled();

    await act(async () => {
      fireEvent(input, 'blur');
    });
    expect(unregisterMock).toHaveBeenCalled();
  });

  it('SocietyInput notifies coordinator on focus and blur', async () => {
    const registerMock = jest.fn();
    const unregisterMock = jest.fn();
    const coordinator: KeyboardFocusCoordinator = {
      registerFocusedInput: registerMock,
      unregisterFocusedInput: unregisterMock,
      ensureVisible: jest.fn(),
    };

    await renderWithProviders(
      <KeyboardFocusContext.Provider value={coordinator}>
        <SocietyInput
          label="Phone"
          placeholder="98765 43210"
          testID="society-input"
        />
      </KeyboardFocusContext.Provider>
    );

    const input = screen.getByTestId('society-input');
    expect(input.props.cursorColor).toBe('#064F43');

    await act(async () => {
      fireEvent(input, 'focus');
    });
    expect(registerMock).toHaveBeenCalled();

    await act(async () => {
      fireEvent(input, 'blur');
    });
    expect(unregisterMock).toHaveBeenCalled();
  });

  it('SearchInputBar notifies coordinator and highlights on focus', async () => {
    const registerMock = jest.fn();
    const unregisterMock = jest.fn();
    const coordinator: KeyboardFocusCoordinator = {
      registerFocusedInput: registerMock,
      unregisterFocusedInput: unregisterMock,
      ensureVisible: jest.fn(),
    };

    await renderWithProviders(
      <KeyboardFocusContext.Provider value={coordinator}>
        <SearchInputBar
          value=""
          onChangeText={jest.fn()}
          placeholder="Search directory"
          testID="search-bar"
        />
      </KeyboardFocusContext.Provider>
    );

    const input = screen.getByPlaceholderText('Search directory');
    expect(input.props.cursorColor).toBe('#064F43');

    await act(async () => {
      fireEvent(input, 'focus');
    });
    expect(registerMock).toHaveBeenCalled();

    await act(async () => {
      fireEvent(input, 'blur');
    });
    expect(unregisterMock).toHaveBeenCalled();
  });
});

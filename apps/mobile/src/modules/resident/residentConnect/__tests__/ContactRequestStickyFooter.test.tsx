import { fireEvent, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { renderContactRequestScreen } from './contactRequestTestHarness';

describe('contact request sticky footer', () => {
  it('reserves measured footer space and keeps privacy content scrollable above it', async () => {
    await renderContactRequestScreen();
    const footer = screen.getByTestId('contact-request-sticky-footer');
    await fireEvent(footer, 'layout', { nativeEvent: { layout: { height: 128 } } });

    const scrollStyle = StyleSheet.flatten(screen.getByTestId('contact-request-scroll-view').props.contentContainerStyle);
    const footerStyle = StyleSheet.flatten(screen.getByTestId('contact-request-sticky-footer').props.style);
    expect(scrollStyle.paddingBottom).toBe(148);
    expect(footerStyle.paddingBottom).toBeGreaterThanOrEqual(12);
    expect(screen.getByTestId('contact-request-privacy-panel')).toBeTruthy();
  });
});

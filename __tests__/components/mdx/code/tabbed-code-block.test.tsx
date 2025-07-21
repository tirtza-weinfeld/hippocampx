import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TabbedCodeBlock, { TabbedCodeTab } from '@/components/mdx/code/tabbed-code-block';

const tabs: TabbedCodeTab[] = [
  {
    label: 'Tab 1',
    code: 'print("Hello from Tab 1")',
    language: 'python',
  },
  {
    label: 'Tab 2',
    code: 'console.log("Hello from Tab 2")',
    language: 'javascript',
  },
];

describe('TabbedCodeBlock', () => {
  it('renders all tab labels', () => {
    render(<TabbedCodeBlock tabs={tabs} />);
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeInTheDocument();
  });

  it('shows the code for the first tab by default', () => {
    render(<TabbedCodeBlock tabs={tabs} />);
    expect(screen.getByText('print("Hello from Tab 1")')).toBeInTheDocument();
    expect(screen.queryByText('console.log("Hello from Tab 2")')).not.toBeInTheDocument();
  });

  it('switches code when a different tab is clicked', () => {
    render(<TabbedCodeBlock tabs={tabs} />);
    const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
    fireEvent.click(tab2);
    expect(screen.getByText('console.log("Hello from Tab 2")')).toBeInTheDocument();
    expect(screen.queryByText('print("Hello from Tab 1")')).not.toBeInTheDocument();
  });

  it('applies correct aria-selected attribute', () => {
    render(<TabbedCodeBlock tabs={tabs} />);
    const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
    const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
    expect(tab1).toHaveAttribute('aria-selected', 'true');
    expect(tab2).toHaveAttribute('aria-selected', 'false');
    fireEvent.click(tab2);
    expect(tab1).toHaveAttribute('aria-selected', 'false');
    expect(tab2).toHaveAttribute('aria-selected', 'true');
  });
}); 
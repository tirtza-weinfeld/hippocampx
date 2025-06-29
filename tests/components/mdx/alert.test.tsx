import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Alert from '@/components/mdx/alert';

describe('Alert Component', () => {
  it('should parse content with summary and details correctly', () => {
    const content = "This is a summary.\n\nThis is the detailed explanation with more information.";
    
    render(
      <Alert type="tip" collapsible>
        {content}
      </Alert>
    );

    // Should show summary in the button
    expect(screen.getByText('This is a summary.')).toBeInTheDocument();
  });

  it('should handle content with only summary', () => {
    const content = "This is just a simple summary without details.";
    
    render(
      <Alert type="note" collapsible>
        {content}
      </Alert>
    );

    // Should show the summary
    expect(screen.getByText('This is just a simple summary without details.')).toBeInTheDocument();
  });

  it('should handle content with sentence separation', () => {
    const content = "First sentence. Second sentence with more details.";
    
    render(
      <Alert type="warning" collapsible>
        {content}
      </Alert>
    );

    // Should show first sentence as summary
    expect(screen.getByText('First sentence.')).toBeInTheDocument();
  });

  it('should render non-collapsible alert correctly', () => {
    const content = "Simple alert content";
    
    render(
      <Alert type="important">
        {content}
      </Alert>
    );

    // Should show the full content
    expect(screen.getByText('Simple alert content')).toBeInTheDocument();
  });

  it('should display correct alert type', () => {
    render(
      <Alert type="tip">
        Test content
      </Alert>
    );

    expect(screen.getByText('TIP')).toBeInTheDocument();
  });
}); 
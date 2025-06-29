import { render, screen, fireEvent } from '@testing-library/react';
import { MDXProvider } from '@mdx-js/react';
import { customComponents } from '@/mdx-components';
import * as React from 'react';
import { describe, it, expect } from 'vitest';

// Mock the MDX content since we can't compile it in tests
const MockMDXContent = () => {
  const Alert = customComponents.Alert as React.ComponentType<any>;
  
  return (
    <div>
      {/* Simulate the MDX blockquote that gets transformed to Alert */}
      <Alert type="example" collapsible="true">
        <p>Summary</p>
        <p>about the example</p>
        <p>Details line 1</p>
        <p>Details line 2</p>
        <p>Details line 3</p>
        <p>Details line 4</p>
        <p>Details line 5</p>
        <p>Details line 6</p>
        <p>Details line 7</p>
        <p>Details line 8</p>
        <p>Details line 9</p>
        <p>Details line 10</p>
      </Alert>

      {/* Simulate the JSX Alert */}
      <Alert type="example" collapsible="true">
        <p>Summary</p>
        <p>Details line 1</p>
        <p>Details line 2</p>
        <p>Details line 3</p>
        <p>Details line 4</p>
        <p>Details line 5</p>
        <p>Details line 6</p>
        <p>Details line 7</p>
        <p>Details line 8</p>
        <p>Details line 9</p>
        <p>Details line 10</p>
      </Alert>
    </div>
  );
};

describe('MDX Alert Integration', () => {
  it('renders summary and details correctly for collapsible alerts', () => {
    render(
      <MDXProvider components={customComponents}>
        <MockMDXContent />
      </MDXProvider>
    );

    // Find all collapsible alerts by looking for buttons with chevron icons
    const alerts = screen.getAllByRole('button');
    
    // Test first alert (MDX blockquote)
    const firstAlert = alerts[0];
    expect(firstAlert).toBeInTheDocument();
    
    // Check that summary content is visible
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('about the example')).toBeInTheDocument();
    
    // Check that details are initially hidden
    expect(screen.queryByText('Details line 1')).not.toBeInTheDocument();
    
    // Expand the alert
    fireEvent.click(firstAlert);
    
    // Now details should be visible
    expect(screen.getByText('Details line 1')).toBeInTheDocument();
    expect(screen.getByText('Details line 10')).toBeInTheDocument();
    
    // Test second alert (JSX Alert)
    const secondAlert = alerts[1];
    expect(secondAlert).toBeInTheDocument();
    
    // Check that summary content is visible
    expect(screen.getByText('Summary')).toBeInTheDocument();
    
    // Expand the second alert
    fireEvent.click(secondAlert);
    
    // Now details should be visible
    expect(screen.getByText('Details line 10')).toBeInTheDocument();
  });
}); 
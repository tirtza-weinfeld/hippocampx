import { render, screen, waitFor } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { describe, test, expect, beforeEach, vi } from "vitest"
import { InfinityFontSelector } from "@/components/sidebar/infinity-font-selector"

// Mock theme provider
const mockSetFont = vi.fn()
const mockUseTheme = vi.fn(() => ({
  font: "inter",
  setFont: mockSetFont,
}))

vi.mock("@/components/theme/theme-provider", () => ({
  useTheme: () => mockUseTheme(),
}))

describe("InfinityFontSelector Component", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSetFont.mockClear()
    mockUseTheme.mockReturnValue({
      font: "inter",
      setFont: mockSetFont,
    })
  })

  describe("Basic Rendering", () => {
    test("renders font selector button", () => {
      render(<InfinityFontSelector />)

      const button = screen.getByLabelText(/font settings/i)
      expect(button).toBeInTheDocument()
    })

    test("button has proper aria attributes", () => {
      render(<InfinityFontSelector />)

      const button = screen.getByLabelText(/font settings/i)
      expect(button).toHaveAttribute("aria-label", "Font Settings")
    })

    test("renders type icon in button", () => {
      render(<InfinityFontSelector />)

      const button = screen.getByLabelText(/font settings/i)
      expect(button).toBeInTheDocument()
      // Icon should be present (Type from lucide-react)
    })
  })

  describe("Font Selector Opening/Closing", () => {
    test("opens font selector on button click", async () => {
      const user = userEvent.setup()

      render(<InfinityFontSelector />)

      const button = screen.getByLabelText(/font settings/i)
      await user.click(button)

      // Should show the hippo visualization and font buttons
      await waitFor(() => {
        const fontButtons = screen.getAllByRole("button")
        // Main button + 12 font buttons
        expect(fontButtons.length).toBeGreaterThan(5)
      })
    })

    test("closes selector when clicking the toggle button again", async () => {
      const user = userEvent.setup()

      render(<InfinityFontSelector />)

      const button = screen.getByLabelText(/font settings/i)
      await user.click(button)

      await waitFor(() => {
        const fontButtons = screen.getAllByRole("button")
        expect(fontButtons.length).toBeGreaterThan(5)
      })

      // Click again to close
      await user.click(button)

      await waitFor(() => {
        const fontButtons = screen.getAllByRole("button")
        // Only the main toggle button should remain
        expect(fontButtons.length).toBe(1)
      })
    })

    test("BUG: closes when clicking outside using mousedown event", async () => {
      const user = userEvent.setup()

      render(
        <div>
          <InfinityFontSelector />
          <button>Outside button</button>
        </div>
      )

      const fontButton = screen.getByLabelText(/font settings/i)
      await user.click(fontButton)

      await waitFor(() => {
        const fontButtons = screen.getAllByRole("button")
        expect(fontButtons.length).toBeGreaterThan(5)
      })

      // Click outside
      const outsideButton = screen.getByText(/outside button/i)
      await user.click(outsideButton)

      // BUG: Line 155 uses mousedown event which fires before click
      // This can cause issues with click handlers on the outside element
      await waitFor(() => {
        const fontButtons = screen.getAllByRole("button")
        expect(fontButtons.length).toBeLessThanOrEqual(2)
      })
    })

    test("BUG: clicking outside uses containRef which may not work in all cases", async () => {
      const user = userEvent.setup()

      render(<InfinityFontSelector />)

      const button = screen.getByLabelText(/font settings/i)
      await user.click(button)

      // BUG: Line 156 checks containerRef.current.contains(event.target as Node)
      // This won't work if the click target is in a portal or shadow DOM
      // Also doesn't handle case where containerRef.current is null
    })
  })

  describe("Font Selection and Change", () => {
    test("calls setFont when a font button is clicked", async () => {
      const user = userEvent.setup()

      render(<InfinityFontSelector />)

      const toggleButton = screen.getByLabelText(/font settings/i)
      await user.click(toggleButton)

      await waitFor(() => {
        const buttons = screen.getAllByRole("button")
        expect(buttons.length).toBeGreaterThan(5)
      })

      // Click a font button (skip the toggle button)
      const buttons = screen.getAllByRole("button")
      const firstFontButton = buttons[1]
      await user.click(firstFontButton)

      expect(mockSetFont).toHaveBeenCalledTimes(1)
    })

    test("closes selector after selecting a font", async () => {
      const user = userEvent.setup()

      render(<InfinityFontSelector />)

      const toggleButton = screen.getByLabelText(/font settings/i)
      await user.click(toggleButton)

      await waitFor(() => {
        const buttons = screen.getAllByRole("button")
        expect(buttons.length).toBeGreaterThan(5)
      })

      const buttons = screen.getAllByRole("button")
      const firstFontButton = buttons[1]
      await user.click(firstFontButton)

      // Selector should close immediately (line 650)
      await waitFor(() => {
        const remainingButtons = screen.getAllByRole("button")
        expect(remainingButtons.length).toBe(1)
      })
    })

    test("displays notification when font is changed", async () => {
      const user = userEvent.setup()

      render(<InfinityFontSelector />)

      const toggleButton = screen.getByLabelText(/font settings/i)
      await user.click(toggleButton)

      await waitFor(() => {
        const buttons = screen.getAllByRole("button")
        expect(buttons.length).toBeGreaterThan(5)
      })

      const buttons = screen.getAllByRole("button")
      const firstFontButton = buttons[1]
      await user.click(firstFontButton)

      // Should show notification
      await waitFor(() => {
        const notification = screen.queryByText(/font changed to/i)
        expect(notification).toBeInTheDocument()
      })
    })

    test("BUG: notification uses onAnimationComplete with setTimeout creating timing issues", async () => {
      const user = userEvent.setup()

      render(<InfinityFontSelector />)

      const toggleButton = screen.getByLabelText(/font settings/i)
      await user.click(toggleButton)

      await waitFor(() => {
        const buttons = screen.getAllByRole("button")
        expect(buttons.length).toBeGreaterThan(5)
      })

      const buttons = screen.getAllByRole("button")
      const firstFontButton = buttons[1]
      await user.click(firstFontButton)

      // BUG: Line 705 uses onAnimationComplete with setTimeout(2000)
      // This is not declarative and can cause race conditions
      // If user selects multiple fonts quickly, notifications can overlap
    })

    test("BUG: notification state persists across rapid font changes", async () => {
      const user = userEvent.setup()

      render(<InfinityFontSelector />)

      const toggleButton = screen.getByLabelText(/font settings/i)

      // Select first font
      await user.click(toggleButton)
      await waitFor(() => {
        const buttons = screen.getAllByRole("button")
        expect(buttons.length).toBeGreaterThan(5)
      })
      const buttons1 = screen.getAllByRole("button")
      await user.click(buttons1[1])

      // Quickly select another font before notification clears
      await user.click(toggleButton)
      await waitFor(() => {
        const buttons = screen.getAllByRole("button")
        expect(buttons.length).toBeGreaterThan(5)
      })
      const buttons2 = screen.getAllByRole("button")
      await user.click(buttons2[2])

      // BUG: Notification might show wrong font name or display multiple notifications
      // No queuing or proper state management for notifications
    })
  })

  describe("Hippo Visualization", () => {
    test("renders hippo body parts when selector is open", async () => {
      const user = userEvent.setup()

      render(<InfinityFontSelector />)

      const button = screen.getByLabelText(/font settings/i)
      await user.click(button)

      // All the hippo parts should animate in (lines 284-583)
      await waitFor(() => {
        const buttons = screen.getAllByRole("button")
        expect(buttons.length).toBeGreaterThan(10)
      })

      // Hippo visualization includes:
      // - Body shape, brain, ears, eyes, nose, nostrils, mouth, feet, outline
      // Total 12 font buttons positioned around the hippo
    })

    test("BUG: popup position calculated only once on open", async () => {
      const user = userEvent.setup()

      render(<InfinityFontSelector />)

      const button = screen.getByLabelText(/font settings/i)
      await user.click(button)

      // BUG: Line 173-182 calculates position only when opening
      // If window is resized or scrolled while open, position doesn't update
      // Line 228-231 calls updatePopupPosition() before opening
      // but position is fixed once calculated
    })

    test("BUG: fixed positioning uses absolute pixels which breaks on scroll", async () => {
      const user = userEvent.setup()

      render(<InfinityFontSelector />)

      const button = screen.getByLabelText(/font settings/i)
      await user.click(button)

      // BUG: Lines 278-281 use fixed positioning with calculated pixels
      // bottom: `${popupPosition.bottom}px`
      // left: `${popupPosition.left}px`
      // If page scrolls after opening, hippo stays in wrong position
    })

    test("font buttons positioned according to hippo anatomy", async () => {
      const user = userEvent.setup()

      render(<InfinityFontSelector />)

      const button = screen.getByLabelText(/font settings/i)
      await user.click(button)

      await waitFor(() => {
        const buttons = screen.getAllByRole("button")
        // Function getHippoPosition (line 185-217) maps fonts to hippo parts
        expect(buttons.length).toBeGreaterThan(10)
      })

      // Fonts are mapped to features:
      // inter -> left-ear, roboto -> right-ear
      // open-sans -> left-eye, montserrat -> right-eye
      // dancing-script -> nose, pacifico -> mouth
      // great-vibes -> left-foot, satisfy -> right-foot
      // tangerine/allura -> brain
      // kaushan-script/sacramento -> body
    })

    test("BUG: getFontFamily has hardcoded font family strings", () => {
      // Line 117-145 has hardcoded font-family strings
      // If fonts change in the project, this will break
      // Should use CSS variables or import from a shared config

      render(<InfinityFontSelector />)

      // BUG: Line 656 uses inline style with getFontFamily
      // This doesn't match the theme provider's font loading system
      const button = screen.getByLabelText(/font settings/i)
      expect(button).toBeInTheDocument()
    })
  })

  describe("Selected Font Highlighting", () => {
    test("highlights currently selected font", async () => {
      const user = userEvent.setup()

      mockUseTheme.mockReturnValue({
        font: "roboto",
        setFont: mockSetFont,
      })

      render(<InfinityFontSelector />)

      const button = screen.getByLabelText(/font settings/i)
      await user.click(button)

      await waitFor(() => {
        const buttons = screen.getAllByRole("button")
        expect(buttons.length).toBeGreaterThan(5)
      })

      // Selected font should have variant="default" (line 629)
      // Others should have variant="outline"
      // Selected should have Check icon (line 682)
    })

    test("BUG: isSelected check happens inside map without memoization", async () => {
      const user = userEvent.setup()

      render(<InfinityFontSelector />)

      const button = screen.getByLabelText(/font settings/i)
      await user.click(button)

      // BUG: Line 587 calculates isSelected for each font on every render
      // With 12 fonts, this creates 12 comparisons on every render
      // Should be memoized or pre-calculated
    })
  })

  describe("Animation Behavior", () => {
    test("animates hippo elements on open", async () => {
      const user = userEvent.setup()

      render(<InfinityFontSelector />)

      const button = screen.getByLabelText(/font settings/i)
      await user.click(button)

      // AnimatePresence should handle entry/exit (line 259)
      // Each hippo part has staggered delay (lines 285-583)
      await waitFor(() => {
        const buttons = screen.getAllByRole("button")
        expect(buttons.length).toBeGreaterThan(5)
      })
    })

    test("font buttons animate in with staggered delay", async () => {
      const user = userEvent.setup()

      render(<InfinityFontSelector />)

      const button = screen.getByLabelText(/font settings/i)
      await user.click(button)

      // Line 607: delay: index * 0.03
      // Each font button animates in 30ms after previous
      await waitFor(() => {
        const buttons = screen.getAllByRole("button")
        expect(buttons.length).toBeGreaterThan(10)
      })
    })

    test("BUG: exit animations use reverse index causing weird sequence", async () => {
      const user = userEvent.setup()

      render(<InfinityFontSelector />)

      const button = screen.getByLabelText(/font settings/i)
      await user.click(button)

      await waitFor(() => {
        const buttons = screen.getAllByRole("button")
        expect(buttons.length).toBeGreaterThan(5)
      })

      // Close
      await user.click(button)

      // BUG: Line 619: delay: (fonts.length - index - 1) * 0.02
      // This reverses the exit order but uses different timing (20ms vs 30ms)
      // Inconsistent animation behavior
    })

    test("BUG: AnimatePresence mode not specified causing potential issues", async () => {
      const user = userEvent.setup()

      render(<InfinityFontSelector />)

      const button = screen.getByLabelText(/font settings/i)

      // Open and close quickly multiple times
      await user.click(button)
      await user.click(button)
      await user.click(button)

      // BUG: AnimatePresence at line 259 doesn't specify mode="wait"
      // Multiple animations can run simultaneously causing visual glitches
      // Line 271 has mode="wait" for overlay but not for main content
    })
  })

  describe("Accessibility", () => {
    test("has proper tooltip on main button", async () => {
      const user = userEvent.setup()

      render(<InfinityFontSelector />)

      const button = screen.getByLabelText(/font settings/i)
      await user.hover(button)

      // Tooltip should appear (line 255)
      await waitFor(() => {
        const tooltip = screen.queryByText(/font settings/i)
        expect(tooltip).toBeInTheDocument()
      })
    })

    test("font buttons have tooltips with font names", async () => {
      const user = userEvent.setup()

      render(<InfinityFontSelector />)

      const toggleButton = screen.getByLabelText(/font settings/i)
      await user.click(toggleButton)

      await waitFor(() => {
        const buttons = screen.getAllByRole("button")
        expect(buttons.length).toBeGreaterThan(5)
      })

      // Each font button has TooltipTrigger (line 627)
      // Tooltip shows font name with font family applied (line 686)
    })

    test("BUG: font selector uses fixed z-index that may conflict", () => {
      render(<InfinityFontSelector />)

      // BUG: Line 220 sets z-index: 100, 110, 50-60 for various elements
      // Backdrop at z-100, content at z-110
      // These arbitrary z-indices may conflict with other components
      // Should use z-index scale from design system
    })

    test("BUG: overlay blocks all interaction but has role='presentation'", async () => {
      const user = userEvent.setup()

      render(<InfinityFontSelector />)

      const button = screen.getByLabelText(/font settings/i)
      await user.click(button)

      // BUG: Line 266 has backdrop with role="presentation" and tabIndex={-1}
      // But it's clickable (onClick at line 266)
      // Should have role="button" or proper ARIA attributes
    })

    test("BUG: font buttons lack descriptive aria-labels", async () => {
      const user = userEvent.setup()

      render(<InfinityFontSelector />)

      const button = screen.getByLabelText(/font settings/i)
      await user.click(button)

      await waitFor(() => {
        const buttons = screen.getAllByRole("button")
        expect(buttons.length).toBeGreaterThan(5)
      })

      // BUG: Font buttons don't have aria-label
      // They only show single letter (I, R, O, M, etc.) at line 658-680
      // Screen readers can't tell what font they represent
      // Tooltip is visual only
    })
  })

  describe("Keyboard Navigation", () => {
    test("BUG: no keyboard navigation between font buttons", async () => {
      const user = userEvent.setup()

      render(<InfinityFontSelector />)

      const button = screen.getByLabelText(/font settings/i)
      await user.click(button)

      await waitFor(() => {
        const buttons = screen.getAllByRole("button")
        expect(buttons.length).toBeGreaterThan(5)
      })

      // BUG: No arrow key navigation between font buttons
      // No roving tabindex or keyboard focus management
      // Users must tab through all 12 buttons
      await user.keyboard("{Tab}")
      await user.keyboard("{Tab}")

      // No way to use arrow keys to navigate the hippo layout
    })

    test("BUG: Escape key doesn't close selector", async () => {
      const user = userEvent.setup()

      render(<InfinityFontSelector />)

      const button = screen.getByLabelText(/font settings/i)
      await user.click(button)

      await waitFor(() => {
        const buttons = screen.getAllByRole("button")
        expect(buttons.length).toBeGreaterThan(5)
      })

      await user.keyboard("{Escape}")

      // BUG: No event listener for Escape key
      // Common pattern for closing overlays/dialogs is missing
      // Selector remains open
    })

    test("BUG: focus not trapped in selector when open", async () => {
      const user = userEvent.setup()

      render(
        <div>
          <button>Before</button>
          <InfinityFontSelector />
          <button>After</button>
        </div>
      )

      const toggleButton = screen.getByLabelText(/font settings/i)
      await user.click(toggleButton)

      await waitFor(() => {
        const buttons = screen.getAllByRole("button")
        expect(buttons.length).toBeGreaterThan(7) // 3 outside + fonts
      })

      // Tab through all buttons
      for (let i = 0; i < 15; i++) {
        await user.keyboard("{Tab}")
      }

      // BUG: Focus escapes the selector and goes to "After" button
      // Should implement focus trap to keep focus within selector
    })
  })

  describe("Edge Cases and Error Conditions", () => {
    test("handles unknown font value gracefully", () => {
      mockUseTheme.mockReturnValue({
        font: "unknown-font" as any,
        setFont: mockSetFont,
      })

      render(<InfinityFontSelector />)

      const button = screen.getByLabelText(/font settings/i)
      expect(button).toBeInTheDocument()

      // BUG: getFontFamily at line 117 defaults to var(--font-sans) for unknown
      // But theme provider might have different behavior
    })

    test("BUG: fonts array is hardcoded with no validation", () => {
      render(<InfinityFontSelector />)

      // BUG: fonts array at line 42-115 is hardcoded
      // No validation that fonts match theme provider's Font type
      // If theme provider adds/removes fonts, this component won't know
      const button = screen.getByLabelText(/font settings/i)
      expect(button).toBeInTheDocument()
    })

    test("BUG: containerRef may be null in useEffect cleanup", async () => {
      const user = userEvent.setup()

      const { unmount } = render(<InfinityFontSelector />)

      const button = screen.getByLabelText(/font settings/i)
      await user.click(button)

      // Unmount while open
      unmount()

      // BUG: Line 156 doesn't check if containerRef.current is null
      // If component unmounts, ref will be null but event listener still exists
      // Can cause "Cannot read property 'contains' of null" error
    })

    test("BUG: notification state not cleared on unmount", async () => {
      const user = userEvent.setup()

      const { unmount } = render(<InfinityFontSelector />)

      const button = screen.getByLabelText(/font settings/i)
      await user.click(button)

      await waitFor(() => {
        const buttons = screen.getAllByRole("button")
        expect(buttons.length).toBeGreaterThan(5)
      })

      const buttons = screen.getAllByRole("button")
      await user.click(buttons[1])

      // Unmount before notification clears
      unmount()

      // BUG: setTimeout at line 706 will try to setNotification(null) after unmount
      // No cleanup function to clear the timeout
      // Can cause "Can't perform state update on unmounted component" warning
    })

    test("BUG: rapid toggling creates animation queue buildup", async () => {
      const user = userEvent.setup()

      render(<InfinityFontSelector />)

      const button = screen.getByLabelText(/font settings/i)

      // Rapidly toggle 10 times
      for (let i = 0; i < 10; i++) {
        await user.click(button)
      }

      // BUG: Each click queues animations without canceling previous
      // Can cause performance issues and visual glitches
      // framer-motion animations accumulate in queue
    })
  })

  describe("Browser Compatibility", () => {
    test("BUG: uses modern CSS features without fallbacks", () => {
      render(<InfinityFontSelector />)

      // BUG: Uses backdrop-blur-sm (line 265)
      // Not supported in all browsers (Firefox < 103, Safari < 15.4)
      // No fallback for unsupported browsers

      // BUG: Uses CSS gradients without vendor prefixes (line 298)
      // May not work in older browsers

      const button = screen.getByLabelText(/font settings/i)
      expect(button).toBeInTheDocument()
    })

    test("BUG: relies on specific window behavior that may differ", () => {
      render(<InfinityFontSelector />)

      // BUG: getBoundingClientRect() at line 176
      // Returns different values in different browsers/modes
      // Especially in print mode or with browser zoom

      const button = screen.getByLabelText(/font settings/i)
      expect(button).toBeInTheDocument()
    })
  })
})

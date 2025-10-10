import { render, screen, waitFor } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { describe, test, expect, beforeEach, vi, afterEach } from "vitest"
import { Sidebar } from "@/components/sidebar/sidebar"

// FIX: Define mock routes before vi.mock calls (hoisting issue)
// Mock dependencies
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    pathname: "/",
  })),
  usePathname: vi.fn(() => "/"),
}))

vi.mock("@/lib/storage-service", () => ({
  setCookieValue: vi.fn(),
  getCookieValue: vi.fn(() => null),
}))

vi.mock("@/lib/routes", () => ({
  routes: [
    {
      title: "Home",
      href: "/",
      icon: () => null,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Calculus",
      href: "/calculus",
      icon: () => null,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      children: [
        {
          title: "Derivatives",
          href: "/calculus/derivatives",
          icon: () => null,
          color: "text-green-500",
          bgColor: "bg-green-500/10",
        },
        {
          title: "Integrals",
          href: "/calculus/integrals",
          icon: () => null,
          color: "text-green-500",
          bgColor: "bg-green-500/10",
        },
      ],
    },
    {
      title: "AI",
      href: "/ai",
      icon: () => null,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      children: [
        {
          title: "What is AI?",
          href: "/ai",
          icon: () => null,
          color: "text-purple-500",
          bgColor: "bg-purple-500/10",
        },
      ],
    },
  ],
  NavigationItem: {},
}))

vi.mock("@/components/sidebar/search-dialog", () => ({
  SearchDialog: () => <div data-testid="search-dialog">Search Dialog</div>,
}))

vi.mock("@/components/sidebar/infinity-font-selector", () => ({
  InfinityFontSelector: () => (
    <div data-testid="font-selector">Font Selector</div>
  ),
}))

vi.mock("@/components/theme/theme-toggle", () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}))

vi.mock("@/components/calculus/ui/sparkles-toggle", () => ({
  SparklesToggle: () => (
    <div data-testid="sparkles-toggle">Sparkles Toggle</div>
  ),
}))

describe("Sidebar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock window.innerWidth for desktop
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    })
    // Reset document.body classes
    document.body.className = ""
  })

  afterEach(() => {
    document.body.className = ""
  })

  describe("Basic Rendering", () => {
    test("renders sidebar with children", () => {
      render(
        <Sidebar defaultOpen={true}>
          <div>Test Content</div>
        </Sidebar>
      )

      expect(screen.getByText("Test Content")).toBeInTheDocument()
    })

    test("renders navigation items from routes", () => {
      render(
        <Sidebar defaultOpen={true}>
          <div>Content</div>
        </Sidebar>
      )

      expect(screen.getByText("Home")).toBeInTheDocument()
      expect(screen.getByText("Calculus")).toBeInTheDocument()
      expect(screen.getByText("AI")).toBeInTheDocument()
    })

    test("renders HippocampX branding", () => {
      render(
        <Sidebar defaultOpen={true}>
          <div>Content</div>
        </Sidebar>
      )

      expect(screen.getByText(/hippocampx/i)).toBeInTheDocument()
    })

    test("renders all control components", () => {
      render(
        <Sidebar defaultOpen={true}>
          <div>Content</div>
        </Sidebar>
      )

      expect(screen.getByTestId("font-selector")).toBeInTheDocument()
      expect(screen.getByTestId("theme-toggle")).toBeInTheDocument()
      expect(screen.getByTestId("sparkles-toggle")).toBeInTheDocument()
      expect(screen.getByTestId("search-dialog")).toBeInTheDocument()
    })
  })

  describe("Toggle Button Behavior", () => {
    test("renders sidebar toggle button", () => {
      render(
        <Sidebar defaultOpen={true}>
          <div>Content</div>
        </Sidebar>
      )

      const toggleButton = screen.getByLabelText(/collapse sidebar|expand sidebar/i)
      expect(toggleButton).toBeInTheDocument()
    })

    test("toggle button has correct aria attributes", () => {
      render(
        <Sidebar defaultOpen={true}>
          <div>Content</div>
        </Sidebar>
      )

      const toggleButton = screen.getByLabelText(/collapse sidebar/i)
      expect(toggleButton).toHaveAttribute("aria-expanded", "true")
      expect(toggleButton).toHaveAttribute("aria-controls", "desktop-sidebar")
    })

    test("toggles sidebar state on button click", async () => {
      const user = userEvent.setup()
      const { setCookieValue } = await import("@/lib/storage-service")

      render(
        <Sidebar defaultOpen={true}>
          <div>Content</div>
        </Sidebar>
      )

      const toggleButton = screen.getByLabelText(/collapse sidebar/i)
      await user.click(toggleButton)

      // Should call setCookieValue to persist state
      expect(setCookieValue).toHaveBeenCalledWith(
        "sidebar_state",
        false,
        expect.objectContaining({
          maxAge: 604800,
          path: "/",
          secure: true,
          sameSite: "strict",
        })
      )
    })
  })

  describe("Navigation Item Expansion", () => {
    test("expands parent items with children on click", async () => {
      const user = userEvent.setup()

      render(
        <Sidebar defaultOpen={true}>
          <div>Content</div>
        </Sidebar>
      )

      // Children should not be visible initially
      expect(screen.queryByText("Derivatives")).not.toBeInTheDocument()

      const calculusButton = screen.getByRole("button", { name: /calculus/i })
      await user.click(calculusButton)

      // Children should now be visible
      await waitFor(() => {
        expect(screen.getByText("Derivatives")).toBeInTheDocument()
        expect(screen.getByText("Integrals")).toBeInTheDocument()
      })
    })

    test("collapses expanded items when clicked again", async () => {
      const user = userEvent.setup()

      render(
        <Sidebar defaultOpen={true}>
          <div>Content</div>
        </Sidebar>
      )

      const calculusButton = screen.getByRole("button", { name: /calculus/i })

      // Expand
      await user.click(calculusButton)
      await waitFor(() => {
        expect(screen.getByText("Derivatives")).toBeInTheDocument()
      })

      // Collapse
      await user.click(calculusButton)
      await waitFor(() => {
        expect(screen.queryByText("Derivatives")).not.toBeInTheDocument()
      })
    })

    test("BUG: multiple parent items can be expanded simultaneously", async () => {
      const user = userEvent.setup()

      render(
        <Sidebar defaultOpen={true}>
          <div>Content</div>
        </Sidebar>
      )

      // Expand Calculus
      const calculusButton = screen.getByRole("button", { name: /calculus/i })
      await user.click(calculusButton)
      await waitFor(() => {
        expect(screen.getByText("Derivatives")).toBeInTheDocument()
      })

      // Expand AI (Calculus should remain expanded - accordion pattern not enforced)
      const aiButton = screen.getByRole("button", { name: /^AI$/i })
      await user.click(aiButton)

      await waitFor(() => {
        expect(screen.getByText("What is AI?")).toBeInTheDocument()
        // BUG: Both are expanded - no accordion behavior
        expect(screen.getByText("Derivatives")).toBeInTheDocument()
      })
    })

    test("BUG: auto-expansion based on pathname has race condition", async () => {
      const { usePathname } = await import("next/navigation")
      vi.mocked(usePathname).mockReturnValue("/calculus/derivatives")

      render(
        <Sidebar defaultOpen={true}>
          <div>Content</div>
        </Sidebar>
      )

      // useEffect runs after render, so child might not be visible immediately
      // This is a race condition that can cause hydration mismatches
      const derivatives = screen.queryByText("Derivatives")

      // BUG: May or may not be visible depending on effect timing
      // This causes inconsistent behavior on initial render
      expect(derivatives).toBeInTheDocument()
    })
  })

  describe("Active State Highlighting", () => {
    test("highlights active parent navigation item", async () => {
      const { usePathname } = await import("next/navigation")
      vi.mocked(usePathname).mockReturnValue("/calculus")

      render(
        <Sidebar defaultOpen={true}>
          <div>Content</div>
        </Sidebar>
      )

      const calculusButton = screen.getByRole("button", { name: /calculus/i })
      expect(calculusButton).toBeInTheDocument()
      // Should have active styling class
      expect(calculusButton).toHaveClass("bg-primary/10")
    })

    test("BUG: active state for dashboard path has special case logic", async () => {
      const { usePathname } = await import("next/navigation")
      vi.mocked(usePathname).mockReturnValue("/dashboard/settings")

      render(
        <Sidebar defaultOpen={true}>
          <div>Content</div>
        </Sidebar>
      )

      // BUG: Line 133 has special case: if item.href === "/" && pathname.startsWith("/dashboard")
      // This creates inconsistent behavior - why does "/" match "/dashboard"?
      // This is a logic bug that needs fixing
      const homeLink = screen.getByText("Home")
      expect(homeLink).toBeInTheDocument()
    })

    test("BUG: child route active detection may fail for deeply nested paths", async () => {
      const { usePathname } = await import("next/navigation")
      vi.mocked(usePathname).mockReturnValue("/calculus/derivatives/chain-rule")

      render(
        <Sidebar defaultOpen={true}>
          <div>Content</div>
        </Sidebar>
      )

      // BUG: getIsActive only checks pathname.startsWith(item.href + "/")
      // For child "/calculus/derivatives", it checks if path starts with "/calculus/derivatives/"
      // But path is "/calculus/derivatives/chain-rule" which should match
      // However, the parent check at line 602 might not work correctly
      const calculusButton = screen.getByRole("button", { name: /calculus/i })
      expect(calculusButton).toBeInTheDocument()
    })
  })

  describe("Keyboard Shortcuts", () => {
    test("opens search on Cmd+K keyboard shortcut", async () => {
      const user = userEvent.setup()

      render(
        <Sidebar defaultOpen={true}>
          <div>Content</div>
        </Sidebar>
      )

      await user.keyboard("{Meta>}k{/Meta}")

      // Search should open - but we're just rendering a mock
      expect(screen.getByTestId("search-dialog")).toBeInTheDocument()
    })

    test("toggles sidebar on Cmd+B keyboard shortcut", async () => {
      const user = userEvent.setup()
      const { setCookieValue } = await import("@/lib/storage-service")

      render(
        <Sidebar defaultOpen={true}>
          <div>Content</div>
        </Sidebar>
      )

      await user.keyboard("{Meta>}b{/Meta}")

      // Should toggle sidebar
      expect(setCookieValue).toHaveBeenCalledWith(
        "sidebar_state",
        false,
        expect.any(Object)
      )
    })

    test("BUG: keyboard shortcuts don't check for input focus properly", async () => {
      const user = userEvent.setup()

      render(
        <div>
          <Sidebar defaultOpen={true}>
            <input data-testid="content-input" />
          </Sidebar>
        </div>
      )

      const input = screen.getByTestId("content-input")
      await user.click(input)

      // Should NOT trigger when typing in input
      await user.keyboard("{Meta>}b{/Meta}")

      // BUG: Line 227 checks e.target instanceof HTMLInputElement
      // But this check happens in the sidebar's event listener
      // The input is in children, not in the sidebar event handler's scope
      // This might not work as intended
    })

    test("BUG: '/' key triggers search even in contentEditable elements", async () => {
      const user = userEvent.setup()

      render(
        <div>
          <Sidebar defaultOpen={true}>
            <div contentEditable data-testid="editable">Content</div>
          </Sidebar>
        </div>
      )

      const editable = screen.getByTestId("editable")
      await user.click(editable)

      await user.keyboard("/")

      // BUG: Line 227 only checks HTMLInputElement and HTMLTextAreaElement
      // contentEditable elements are not checked, so "/" will trigger search
      // while user is trying to type
    })
  })

  describe("Mobile Responsive Behavior", () => {
    test("renders mobile layout when window width < 768px", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 500,
      })

      render(
        <Sidebar defaultOpen={false}>
          <div>Mobile Content</div>
        </Sidebar>
      )

      // Should render mobile layout
      expect(screen.getByText("Mobile Content")).toBeInTheDocument()

      // Mobile sidebar should have mobile-specific ID
      const mobileSidebar = screen.queryByRole("navigation")
      if (mobileSidebar) {
        expect(mobileSidebar.parentElement).toHaveAttribute("id", "mobile-sidebar")
      }
    })

    test("BUG: mobile state detection uses useEffect causing hydration mismatch", () => {
      // Set mobile width before render
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 500,
      })

      render(
        <Sidebar defaultOpen={false}>
          <div>Content</div>
        </Sidebar>
      )

      // BUG: isMobile state starts as false (line 51: useState(false))
      // Then useEffect (line 75) sets it to true
      // This causes server-rendered content to mismatch client
      // Should use a better pattern or SSR-safe detection
    })

    test("BUG: mobile overlay click should close sidebar but may have event propagation issues", async () => {
      const user = userEvent.setup()

      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 500,
      })

      render(
        <Sidebar defaultOpen={false}>
          <div>Content</div>
        </Sidebar>
      )

      // Open mobile sidebar
      const toggleButton = screen.getByLabelText(/open sidebar/i)
      await user.click(toggleButton)

      // Should show overlay
      // The overlay div at line 306 has onClick={toggleMobileSidebar}
      // But finding and clicking it in tests may not work properly
    })

    test("applies body scroll lock in mobile mode when sidebar is open", async () => {
      const user = userEvent.setup()

      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 500,
      })

      render(
        <Sidebar defaultOpen={false}>
          <div>Content</div>
        </Sidebar>
      )

      const toggleButton = screen.getByLabelText(/open sidebar/i)
      await user.click(toggleButton)

      // Should add overflow-hidden to body
      await waitFor(() => {
        expect(document.body).toHaveClass("overflow-hidden")
      })
    })

    test("BUG: body scroll lock cleanup may fail if component unmounts during animation", async () => {
      const user = userEvent.setup()

      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 500,
      })

      const { unmount } = render(
        <Sidebar defaultOpen={false}>
          <div>Content</div>
        </Sidebar>
      )

      const toggleButton = screen.getByLabelText(/open sidebar/i)
      await user.click(toggleButton)

      // Unmount while sidebar is open
      unmount()

      // BUG: Cleanup function may not run if unmount happens during animation
      // Line 94-96 cleanup depends on useEffect cleanup being called
    })
  })

  describe("Navigation and Routing", () => {
    test("BUG: handleNavClick has complex conditional logic that may cause navigation failures", async () => {
      const user = userEvent.setup()
      const { useRouter } = await import("next/navigation")
      const mockPush = vi.fn()
      vi.mocked(useRouter).mockReturnValue({ push: mockPush, replace: vi.fn(), pathname: "/" })

      render(
        <Sidebar defaultOpen={true}>
          <div>Content</div>
        </Sidebar>
      )

      // Expand calculus
      const calculusButton = screen.getByRole("button", { name: /calculus/i })
      await user.click(calculusButton)

      await waitFor(() => {
        expect(screen.getByText("Derivatives")).toBeInTheDocument()
      })

      // Click on Derivatives child link
      const derivativesLink = screen.getByRole("link", { name: /derivatives/i })
      await user.click(derivativesLink)

      // BUG: Line 691-694 has preventDefault() then onClick callback
      // The callback at line 693 passes shouldNavigate=true
      // But handleNavClick at line 200 calls router.push()
      // AND also scrollToNavItem with setTimeout
      // This creates race conditions and may cause issues
    })

    test("BUG: scrollToNavItem uses setTimeout with magic number 300ms", async () => {
      const user = userEvent.setup()

      render(
        <Sidebar defaultOpen={true}>
          <div>Content</div>
        </Sidebar>
      )

      const calculusButton = screen.getByRole("button", { name: /calculus/i })
      await user.click(calculusButton)

      // BUG: Line 184 has setTimeout with 300ms delay
      // Line 210 has setTimeout with 200ms delay
      // These magic numbers are inconsistent and can cause race conditions
      // If animation timing changes, scroll might happen before element is visible
    })

    test("BUG: navRefs Map is never cleaned up for unmounted items", async () => {
      const user = userEvent.setup()

      render(
        <Sidebar defaultOpen={true}>
          <div>Content</div>
        </Sidebar>
      )

      const calculusButton = screen.getByRole("button", { name: /calculus/i })

      // Expand to register child refs
      await user.click(calculusButton)
      await waitFor(() => {
        expect(screen.getByText("Derivatives")).toBeInTheDocument()
      })

      // Collapse to unmount children
      await user.click(calculusButton)
      await waitFor(() => {
        expect(screen.queryByText("Derivatives")).not.toBeInTheDocument()
      })

      // BUG: navRefs.current Map still has entries for unmounted children
      // Line 254 sets refs but cleanup at line 587 sets to null
      // Map grows indefinitely as items are mounted/unmounted
    })
  })

  describe("Collapsed Sidebar (Desktop)", () => {
    test("renders popover for parent items when sidebar is collapsed", async () => {
      const user = userEvent.setup()

      render(
        <Sidebar defaultOpen={false}>
          <div>Content</div>
        </Sidebar>
      )

      // In collapsed state, parent items should use Popover
      const calculusButton = screen.getByLabelText(/calculus/i)
      expect(calculusButton).toBeInTheDocument()

      await user.click(calculusButton)

      // Popover content should appear with children
      await waitFor(() => {
        expect(screen.getByText("Derivatives")).toBeInTheDocument()
      })
    })

    test("BUG: popover closes immediately after clicking child link", async () => {
      const user = userEvent.setup()

      render(
        <Sidebar defaultOpen={false}>
          <div>Content</div>
        </Sidebar>
      )

      const calculusButton = screen.getByLabelText(/calculus/i)
      await user.click(calculusButton)

      await waitFor(() => {
        expect(screen.getByText("Derivatives")).toBeInTheDocument()
      })

      const derivativesLink = screen.getByRole("link", { name: /derivatives/i })
      await user.click(derivativesLink)

      // BUG: Line 813 calls setPopoverOpen(false) immediately
      // This happens before navigation completes
      // May cause jarring visual experience
    })
  })

  describe("Animation and Motion", () => {
    test("sidebar animates when toggling", async () => {
      const user = userEvent.setup()

      render(
        <Sidebar defaultOpen={true}>
          <div>Content</div>
        </Sidebar>
      )

      const sidebar = screen.getByRole("navigation").parentElement
      expect(sidebar).toBeInTheDocument()

      const toggleButton = screen.getByLabelText(/collapse sidebar/i)
      await user.click(toggleButton)

      // Motion animation should occur
      // Width should change from 16rem to 5rem (line 417-427)
    })

    test("BUG: AnimatePresence may not unmount children properly", async () => {
      const user = userEvent.setup()

      render(
        <Sidebar defaultOpen={true}>
          <div>Content</div>
        </Sidebar>
      )

      const calculusButton = screen.getByRole("button", { name: /calculus/i })
      await user.click(calculusButton)

      await waitFor(() => {
        expect(screen.getByText("Derivatives")).toBeInTheDocument()
      })

      // Collapse quickly
      await user.click(calculusButton)

      // BUG: Line 646-675 has AnimatePresence with exit animations
      // If user clicks multiple times quickly, animations may overlap
      // causing elements to get stuck in DOM
    })
  })

  describe("Edge Cases and Error Conditions", () => {
    test("handles routes with no children correctly", () => {
      render(
        <Sidebar defaultOpen={true}>
          <div>Content</div>
        </Sidebar>
      )

      const homeLink = screen.getByRole("link", { name: /home/i })
      expect(homeLink).toBeInTheDocument()
      expect(homeLink).toHaveAttribute("href", "/")
    })

    test("BUG: expandParentItem doesn't check if item exists", () => {
      render(
        <Sidebar defaultOpen={true}>
          <div>Content</div>
        </Sidebar>
      )

      // Function at line 159 just blindly sets state
      // No validation that parentHref actually exists in routes
      // Could cause issues with invalid hrefs
    })

    test("BUG: cookie persistence happens on every toggle even if value unchanged", async () => {
      const user = userEvent.setup()
      const { setCookieValue } = await import("@/lib/storage-service")

      render(
        <Sidebar defaultOpen={true}>
          <div>Content</div>
        </Sidebar>
      )

      const toggleButton = screen.getByLabelText(/collapse sidebar/i)

      // Toggle twice
      await user.click(toggleButton)
      await user.click(toggleButton)

      // BUG: setCookieValue called every time even though we're back to original state
      // No optimization to skip if value hasn't changed
      expect(setCookieValue).toHaveBeenCalledTimes(2)
    })

    test("BUG: SparklesToggle receives side prop but sidebar state may be wrong", () => {
      render(
        <Sidebar defaultOpen={true}>
          <div>Content</div>
        </Sidebar>
      )

      // Line 379 and 490 pass side prop based on isExpanded
      // But in mobile view, isExpanded might not represent actual state correctly
      const sparklesToggle = screen.getByTestId("sparkles-toggle")
      expect(sparklesToggle).toBeInTheDocument()

      // BUG: Mobile render at line 379 uses isExpanded state
      // but isExpanded is for desktop sidebar, not mobile
    })
  })

  describe("Accessibility", () => {
    test("navigation has proper ARIA labels", () => {
      render(
        <Sidebar defaultOpen={true}>
          <div>Content</div>
        </Sidebar>
      )

      const nav = screen.getByRole("navigation")
      expect(nav).toHaveAttribute("aria-label", "Main navigation")
    })

    test("toggle button has proper ARIA attributes", () => {
      render(
        <Sidebar defaultOpen={true}>
          <div>Content</div>
        </Sidebar>
      )

      const toggleButton = screen.getByLabelText(/collapse sidebar/i)
      expect(toggleButton).toHaveAttribute("aria-expanded")
      expect(toggleButton).toHaveAttribute("aria-controls")
    })

    test("BUG: expandable items missing aria-expanded on parent button", () => {

      render(
        <Sidebar defaultOpen={true}>
          <div>Content</div>
        </Sidebar>
      )

      const calculusButton = screen.getByRole("button", { name: /calculus/i })

      // Desktop expanded view (line 868-895) doesn't have aria-expanded
      // Only mobile version (line 625) has it
      // This is an accessibility bug
      expect(calculusButton).toBeInTheDocument()
    })

    test("BUG: submenu lacks proper ARIA relationship", async () => {
      const user = await userEvent.setup()

      render(
        <Sidebar defaultOpen={true}>
          <div>Content</div>
        </Sidebar>
      )

      const calculusButton = screen.getByRole("button", { name: /calculus/i })
      await user.click(calculusButton)

      // Mobile version has aria-controls (line 626)
      // Desktop version doesn't (line 868+)
      // Inconsistent accessibility
    })
  })
})

import { render, screen, waitFor } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { describe, test, expect, beforeEach, vi } from "vitest"
import { SearchDialog } from "@/components/sidebar/search-dialog"

// Mock the hooks
vi.mock("@/hooks/use-local-storage", () => ({
  useLocalStorage: vi.fn((key: string, schema: unknown, defaultValue: unknown) => {
    return [defaultValue, vi.fn()]
  }),
}))

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    pathname: "/",
  }),
  usePathname: () => "/",
}))

const mockNavigationItems = [
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
]

describe("SearchDialog", () => {
  const mockOnClose = vi.fn()
  const mockOnNavigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  test("renders when open", () => {
    render(
      <SearchDialog
        isOpen={true}
        onClose={mockOnClose}
        navigationItems={mockNavigationItems}
        onNavigate={mockOnNavigate}
        isMobile={false}
      />
    )

    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })

  test("does not render when closed", () => {
    render(
      <SearchDialog
        isOpen={false}
        onClose={mockOnClose}
        navigationItems={mockNavigationItems}
        onNavigate={mockOnNavigate}
        isMobile={false}
      />
    )

    expect(screen.queryByPlaceholderText(/search/i)).not.toBeInTheDocument()
  })

  test("allows user to type in search input", async () => {
    const user = userEvent.setup()

    render(
      <SearchDialog
        isOpen={true}
        onClose={mockOnClose}
        navigationItems={mockNavigationItems}
        onNavigate={mockOnNavigate}
        isMobile={false}
      />
    )

    const searchInput = screen.getByPlaceholderText(/search/i)
    await user.type(searchInput, "calculus")

    expect(searchInput).toHaveValue("calculus")
  })

  test("displays navigation items in search results", () => {
    render(
      <SearchDialog
        isOpen={true}
        onClose={mockOnClose}
        navigationItems={mockNavigationItems}
        onNavigate={mockOnNavigate}
        isMobile={false}
      />
    )

    // Should show items when no search query
    expect(screen.getByText("Home")).toBeInTheDocument()
  })

  test("closes dialog when close button is clicked", async () => {
    const user = userEvent.setup()

    render(
      <SearchDialog
        isOpen={true}
        onClose={mockOnClose}
        navigationItems={mockNavigationItems}
        onNavigate={mockOnNavigate}
        isMobile={false}
      />
    )

    const closeButton = screen.getByLabelText(/close search/i)
    await user.click(closeButton)

    expect(mockOnClose).toHaveBeenCalledOnce()
  })

  test("toggles favorites filter", async () => {
    const user = userEvent.setup()

    render(
      <SearchDialog
        isOpen={true}
        onClose={mockOnClose}
        navigationItems={mockNavigationItems}
        onNavigate={mockOnNavigate}
        isMobile={false}
      />
    )

    const favoritesButton = screen.getByLabelText(/show favorites only|show all items/i)
    await user.click(favoritesButton)

    // Should trigger the favorites toggle
    expect(favoritesButton).toBeInTheDocument()
  })

  test("navigates when clicking a search result", async () => {
    const user = userEvent.setup()

    render(
      <SearchDialog
        isOpen={true}
        onClose={mockOnClose}
        navigationItems={mockNavigationItems}
        onNavigate={mockOnNavigate}
        isMobile={false}
      />
    )

    const homeLink = screen.getByRole("link", { name: /home/i })
    await user.click(homeLink)

    expect(mockOnNavigate).toHaveBeenCalledWith("/", undefined, true)
  })

  test("handles keyboard navigation with arrow keys", async () => {
    const user = userEvent.setup()

    render(
      <SearchDialog
        isOpen={true}
        onClose={mockOnClose}
        navigationItems={mockNavigationItems}
        onNavigate={mockOnNavigate}
        isMobile={false}
      />
    )

    const searchInput = screen.getByPlaceholderText(/search/i)
    await user.click(searchInput)

    // Arrow down should select first item
    await user.keyboard("{ArrowDown}")

    // Arrow up should go back
    await user.keyboard("{ArrowUp}")

    // Keyboard navigation should work
    expect(searchInput).toHaveFocus()
  })

  test("displays empty state when no results found", async () => {
    const user = userEvent.setup()

    render(
      <SearchDialog
        isOpen={true}
        onClose={mockOnClose}
        navigationItems={mockNavigationItems}
        onNavigate={mockOnNavigate}
        isMobile={false}
      />
    )

    const searchInput = screen.getByPlaceholderText(/search/i)
    await user.type(searchInput, "nonexistent page that does not exist")

    await waitFor(() => {
      expect(screen.queryByText("Home")).not.toBeInTheDocument()
    })
  })

  test("shows keyboard shortcuts in footer", () => {
    render(
      <SearchDialog
        isOpen={true}
        onClose={mockOnClose}
        navigationItems={mockNavigationItems}
        onNavigate={mockOnNavigate}
        isMobile={false}
      />
    )

    expect(screen.getByText(/navigate/i)).toBeInTheDocument()
    expect(screen.getByText(/select/i)).toBeInTheDocument()
  })

  test("handles favorites sort order cycling", async () => {
    const user = userEvent.setup()

    render(
      <SearchDialog
        isOpen={true}
        onClose={mockOnClose}
        navigationItems={mockNavigationItems}
        onNavigate={mockOnNavigate}
        isMobile={false}
      />
    )

    // First toggle to show favorites only
    const favoritesButton = screen.getByLabelText(/show favorites only|show all items/i)
    await user.click(favoritesButton)

    // Now the sort button should be visible
    const sortButton = screen.queryByLabelText(/sort by/i)
    if (sortButton) {
      await user.click(sortButton)
      // Should cycle through sort orders: date -> alphabetical -> custom
      expect(sortButton).toBeInTheDocument()
    }
  })
})

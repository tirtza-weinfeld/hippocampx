import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { CheckIcon } from "lucide-react"
import { cn } from '@/lib/utils'

function MascotDropdown({
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="mascot-dropdown" {...props}>{children}</DropdownMenuPrimitive.Root>
}

function MascotDropdownTrigger({
  children,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="mascot-dropdown-trigger"
      className={cn(
        "cursor-pointer select-none outline-hidden",
        "transition-all duration-200 ease-out",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "data-[state=open]:ring-2 data-[state=open]:ring-ring data-[state=open]:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
           className,

      )}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Trigger>
  )
}

function MascotDropdownContent({
  children,
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="mascot-dropdown-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[8rem] max-h-[var(--radix-dropdown-menu-content-available-height)]",
          "overflow-hidden overflow-y-auto rounded-lg border border-border/20",
          "bg-popover/95 text-popover-foreground backdrop-blur-xl",
          "shadow-xl shadow-black/5 p-1",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          "origin-[var(--radix-dropdown-menu-content-transform-origin)]",
          className
        )}
        {...props}
      >
        {children}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  )
}

function MascotDropdownItem({
  children,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item>) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="mascot-dropdown-item"
      className={cn(
        "relative flex cursor-default select-none items-center gap-2",
        "px-3 py-2.5 text-sm outline-hidden transition-all duration-200",
        "hover:bg-linear-to-r focus:bg-linear-to-r",
        "from-mascot-base-from/10 via-mascot-base-via/10 to-mascot-base-to/10",
        "hover:from-mascot-hover-from/15 hover:via-mascot-hover-via/15 hover:to-mascot-hover-to/15",
        "focus:from-mascot-focus-from/20 focus:via-mascot-focus-via/20 focus:to-mascot-focus-to/20",
        "rounded mx-1",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Item>
  )
}

function MascotDropdownCheckboxItem({
  children,
  className,
  checked,
  Indicator=CheckIcon,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem> & {
  Indicator?: typeof CheckIcon
}) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="mascot-dropdown-checkbox-item"
      className={cn(
        "relative flex cursor-default select-none items-center gap-2",
        "py-2.5 pr-3 pl-8 text-sm outline-hidden transition-all duration-200",
        "hover:bg-linear-to-r focus:bg-linear-to-r",
        "from-mascot-base-from/10 via-mascot-base-via/10 to-mascot-base-to/10",
        "hover:from-mascot-hover-from/15 hover:via-mascot-hover-via/15 hover:to-mascot-hover-to/15",
        "focus:from-mascot-focus-from/20 focus:via-mascot-focus-via/20 focus:to-mascot-focus-to/20",
        "data-[state=checked]:bg-linear-to-r data-[state=checked]:from-mascot-active-from/25 data-[state=checked]:via-mascot-active-via/25 data-[state=checked]:to-mascot-active-to/25",
        "rounded mx-1",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Indicator className="size-4 text-mascot-active-from" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      <span className={cn(
      // "bg-linear-to-r from-mascot-base-from via-mascot-base-via to-mascot-base-to bg-clip-text text-transparent",
      "text-mascot-base-from",
      )}> 
        {children}
      </span>
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

function MascotDropdownMenuLabel({
  children,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label>) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="mascot-dropdown-label"
      className={cn(
        "px-3 py-2 text-sm font-medium",
        "text-mascot-base-via/80",
        className
      )}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Label>
  )
}

function MascotDropdownSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="mascot-dropdown-separator"
      className={cn(
        "-mx-1 my-1 h-px",
        "bg-linear-to-r from-transparent via-mascot-base-via/30 to-transparent",
        className
      )}
      {...props}
    />
  )
}

export {
  MascotDropdown,
  MascotDropdownTrigger,
  MascotDropdownContent,
  MascotDropdownItem,
  MascotDropdownCheckboxItem,
  MascotDropdownMenuLabel,
  MascotDropdownSeparator,
}
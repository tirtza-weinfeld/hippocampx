class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None


def linked_list_cycle(head: ListNode | None) -> bool:
    slow = fast = head
    while fast and fast.next:
        if (slow := slow.next) == (fast := fast.next.next):
            return True
    return False

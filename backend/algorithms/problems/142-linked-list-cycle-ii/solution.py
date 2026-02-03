class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None


def linked_list_start(head: ListNode | None) -> ListNode:
    slow = fast = head
    while fast and fast.next and (slow := slow.next) != (fast := fast.next.next):
        pass
    if not fast or not fast.next:
        return None

    slow = head
    while slow != fast:
        slow, fast = slow.next, fast.next
    return slow

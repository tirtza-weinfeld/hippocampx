class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def middle_of_the_linked_list(self, head: ListNode | None) -> ListNode | None:
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
    return slow

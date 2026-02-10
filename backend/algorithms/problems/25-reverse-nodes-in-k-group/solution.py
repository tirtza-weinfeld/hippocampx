class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def reverseKGroup(head: ListNode | None, k: int) -> ListNode | None:
    """
    Intuition:
        Detach-and-Prepend, Reversing a Block by Building a Chain from the Boundary:
        Imagine holding a growing reversed chain in your left hand (initially it is just the node after the block),\
        and with your right hand you repeatedly detach the first node of the block and attach it to the front of\
        that chain; after `k` attachments, the block is reversed and already connected back to the list.
    Variables:
        pre: node immediately before the current k-block
        rev: head of the growing reversed chain (starts after block)
        cur: first node in the current block
        end: will move to the last node of the current k-block
    """
    pre = dummy = ListNode(0, head)
    while True:
        end = pre                            # will move to the last node of the k-block
        for _ in range(k):
            end = end.next                   # advance end forward
            if not end:
                return dummy.next            # fewer than k nodes remain → stop
        rev, cur = end.next, pre.next
        for _ in range(k):
            cur.next, rev, cur = rev, cur, cur.next  # detach cur from front of block and attach it to front of reversed chain
        pre.next, pre = rev, pre.next        # connect previous part to new block head; move pre to block tail

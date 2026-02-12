from heapq import heappop, heappush


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class Solution:
    def mergeKLists(self, lists: list[ListNode | None]) -> ListNode | None:
        """
        Intuition:
            Perform a k-way merge:
            Maintain a min-heap containing the smallest currently available\
            node from each list. Repeatedly extract the minimum and push\
            its successor from the same list.

        Time Complexity:
            O(N log k)

        Expressions:
            '(node.val, i, node)' : heap orders lexicographically; `node.val` is primary key, `i` is required tie-breaker when vals are equal.
            'heappop(h)' : extracts the globally smallest available node.
            'cur.next = cur = node' : append extracted node and advance tail pointer.
            '(node.next.val, i, node.next)' : advance only the list that supplied the node.

        Variables:
            h     : heap of frontier nodes
            i     : originating list index (tie-breaker)
            node  : extracted smallest node
            cur   : tail pointer of merged list
            dummy : sentinel head
        """
        h = []  # min-heap storing (value, list index, node)

        for i, node in enumerate(lists):
            if node:
                heappush(h, (node.val, i, node))  # push first node of each non-empty list

        dummy = cur = ListNode(0)  # sentinel simplifies pointer wiring

        while h:
            _, i, node = heappop(h)  # smallest available node
            cur.next = cur = node    # append and advance tail
            if node.next:
                heappush(h, (node.next.val, i, node.next))  # push successor from same list

        return dummy.next  # head of merged list

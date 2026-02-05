class Solution:
    def sortColors(self, nums: list[int]) -> None:
        """
        

        Intuition:
            Sorts the array in-place using the Dutch National Flag algorithm:
                The algorithm partitions the array into three distinct 'zones' using three pointers (red, white, blue).
                As we scan with the 'white' pointer, we ensure that every element is moved to its respective color zone
    
        Variables:
            red: The index of the first non-zero element; the "landing spot" for the next 0.
            white: The current scanner; the left boundary of the "unknown" elements yet to be processed.
            blue: The index of the first non-two element; the "landing spot" for the next 2.


        """
        red, white, blue = 0, 0, len(nums) - 1

        while white <= blue:# Process elements until the white (scanner) pointer passes the blue boundary
            match nums[white]:
                case 0: # Move 0 to the red section. Since the value swapped from index 'red' is guaranteed to be a 1, we advance both.
                    nums[red], nums[white] = nums[white], nums[red]
                    red += 1
                    white += 1
                case 1: # 1 is already in the correct middle section; just move the scanner.
                    white += 1
                case 2: # Move 2 to the blue section. We don't advance 'white' because the new value swapped from the end must be inspected next.
                    nums[white], nums[blue] = nums[blue], nums[white]
                    blue -= 1

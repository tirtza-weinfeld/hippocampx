import bisect


class Solution:
    def countSmaller(self, nums: list[int]) -> list[int]:

        counts=[0]*(n:=len(nums))
        X=[]

        for i in range(n-1,-1,-1):
            x=nums[i]
            index=bisect.bisect_left(X,x)
            if index ==len(X):
                X.append(x)
            else:
                X.insert(index,x)
            counts[i]=index
        return counts



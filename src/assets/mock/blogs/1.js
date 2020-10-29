module.exports = {
    blogId: 1,
    blogTitle: '求两两和不被k整除的子序列',
    blogContent: '已知一个长度为N，值为整数的随机序列$a_1,a_2,...,a_N$，求出两两和不被k整除的子序列的个数，子序列长度可以为0，即空序列。\n' +
        '\n' +
        '解：\n' +
        '\n' +
        '考虑递归，递归求解前n个数的序列$a_1,a_2,...a_n\\ (0≤n≤N)$的解和中间数据。\n' +
        '\n' +
        '设$G(n)$为长度为n的序列满足条件的所有子序列个数，\n' +
        '\n' +
        '设$f(n, i)\\ (0≤i≤k)$为满足条件的子序列中不包含值$a_m(a_m≡i\\ mod\\ k)$的序列的个数，\n' +
        '\n' +
        '设$g(n, i)\\ (0≤i≤k)$为满足条件的子序列中包含值$a_m(a_m≡i\\ mod\\ k)$的序列的个数。\n' +
        '\n' +
        '\n' +
        '则有递推式：\n' +
        '\n' +
        '$$G(n+1)=G(n)+f(n, (k-a_{n+1})\\ mod\\ k)$$\n' +
        '\n' +
        '$$f(n+1,i)=G(n+1)-g(n+1,i)$$\n' +
        '\n' +
        '$$g(n+1,i)=g(n,i)+\n' +
        '\\begin{cases}\n' +
        'f(n,(k-a_{n+1})\\ mod\\ k)&i≡a_{n+1}\\ mod\\ k\\\\\n' +
        '0&i≡(k-a_{n+1})\\ mod\\ k ∧ i\\not\\equiv​a_{n+1}\\ mod\\ k\\\\\n' +
        'g(n,i)&other\n' +
        '\\end{cases}$$\n' +
        '初始值为：\n' +
        '$G(0)=1,f(0,i)=1,g(1,i)=0\\ (0≤i≤k)$',
    blogDate: '2020-08-23 14:22:56'
}
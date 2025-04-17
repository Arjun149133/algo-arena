#include <iostream>
#include <vector>
#include <string>
using namespace std;

##USER_CODE_HERE##

    int
    main()
{
  int n;
  cin >> n;
  vector<int> arr(n);
  for (int i = 0; i < n; ++i)
    cin >> arr[i];

  cout << findMaxElement(n, arr);
  return 0;
}
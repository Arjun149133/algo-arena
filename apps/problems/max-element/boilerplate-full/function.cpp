#include <iostream>
#include <string>
#include <vector>

##USER_CODE_HERE##

int main() {
std::string line;
std::vector<std::string> input;
while (std::getline(std::cin, line)) {
  input.push_back(line);
}
int n = std::stoi(input[0]);
std::vector<int> arr;
std::string temp;
std::stringstream ss(input[1]);
while (ss >> temp) arr.push_back(std::stoi(temp));

std::cout << findMaxElement(n, arr) << std::endl;
  return 0;
}
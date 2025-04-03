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
int a = std::stoi(input[0]);
int b = std::stoi(input[1]);

std::cout << findProduct(a, b) << std::endl;
  return 0;
}
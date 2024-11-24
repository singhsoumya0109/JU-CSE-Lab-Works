#include <iostream>
#include <unistd.h>
#include <sys/wait.h>
#include <cstdlib>
#include <ctime>
using namespace std;
void childProcess(const string &name, int iterations)
{
    srand(time(0) + getpid());
    for (int i = 1; i <= iterations; i++)
    {
        cout << "Process " << name << " iteration " << i << endl;
        int sleepTime = rand() % 3 + 1;
        sleep(sleepTime);
    }
}
int main()
{
    int iterations = 10;
    pid_t pidX = fork();
    if (pidX < 0)
    {
        cerr << "Failed to create process X." << endl;
        return 1;
    }
    else if (pidX == 0)
    {
        childProcess("X", iterations);
        return 0;
    }
    pid_t pidY = fork();
    if (pidY < 0)
    {
        cerr << "Failed to create process Y." << endl;
        return 1;
    }
    else if (pidY == 0)
    {
        childProcess("Y", iterations);
        return 0;
    }
    wait(NULL);
    wait(NULL);
    cout << "Both processes X and Y have completed." << endl;
    return 0;
}
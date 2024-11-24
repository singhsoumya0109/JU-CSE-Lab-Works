#include <bits/stdc++.h>
#define TIMESLICE 25
using namespace std;
struct Job
{
    int id;
    int arrivalTime;
    vector<int> bursts;
    int endTime = 0;
    int startTime = -1;
    int burstIndex = 0;
};
vector<Job> readJobProfiles(const string &filename)
{
    ifstream file(filename);
    vector<Job> jobs;
    if (!file)
    {
        cerr << "Error: Cannot open file!" << endl;
        return jobs;
    }
    int id, arrival, burst;
    while (file >> id >> arrival)
    {
        Job job;
        job.id = id;
        job.arrivalTime = arrival;
        while (file >> burst && burst != -1)
        {
            job.bursts.push_back(burst);
        }
        jobs.push_back(job);
    }
    file.close();
    return jobs;
}
struct JobComparator
{
    bool operator()(Job &a, Job &b)
    {
        return a.arrivalTime < b.arrivalTime;
    }
};
void round_robin(vector<Job> jobs)
{
    int time = 0, slice = TIMESLICE, n = jobs.size(), index = 0, current = -1,
        nextIO = -1;
    sort(jobs.begin(), jobs.end(), JobComparator());
    queue<int> ready;
    queue<int> io;
    vector<Job> finished;
    while (finished.size() < n)
    {
        if (nextIO != -1)
        {
            io.push(nextIO);
            nextIO = -1;
        }
        if (index < n && jobs[index].arrivalTime == time)
            ready.push(index++);
        if (slice == TIMESLICE)
        {
            if (ready.size() > 0)
            {
                current = ready.front();
                ready.pop();
                if (jobs[current].startTime == -1)
                    jobs[current].startTime = time;
            }
            if (current != -1)
            {
                jobs[current].bursts[jobs[current].burstIndex]--;
                slice--;
            }
        }
        else
        {
            slice--;
            if (slice == 0 || jobs[current].bursts[jobs[current].burstIndex] == 0)
            {
                if (jobs[current].bursts[jobs[current].burstIndex] == 0)
                {
                    jobs[current].burstIndex++;
                    if (jobs[current].burstIndex ==
                        jobs[current].bursts.size())
                    {
                        jobs[current].endTime = time;
                        finished.push_back(jobs[current]);
                    }
                    else
                        nextIO = current;
                }
                else
                    ready.push(current);
                slice = TIMESLICE;
                current = -1;
            }
        }
        if (io.size() > 0)
        {
            int curr_io = io.front();
            jobs[curr_io].bursts[jobs[curr_io].burstIndex]--;
            if (jobs[curr_io].bursts[jobs[curr_io].burstIndex] == 0)
            {
                jobs[curr_io].burstIndex++;
                if (jobs[curr_io].burstIndex == jobs[curr_io].bursts.size())
                {
                    jobs[curr_io].endTime = time;
                    finished.push_back(jobs[curr_io]);
                }
                else
                    ready.push(curr_io);
                io.pop();
            }
        }
        time++;
    }
    int net_wait = 0, net_turnaround = 0;
    for (Job j : finished)
    {
        int wait = j.startTime - j.arrivalTime;
        int turnaround = j.endTime - j.arrivalTime;
        cout << "ID= " << j.id << ", arrival= " << j.arrivalTime << ", start= 
                                                                    " << j.startTime << ",
            end = " << j.endTime << ", wait = " << wait << ",
            turnaround = " << turnaround << endl;
            net_wait += wait;
        net_turnaround += turnaround;
    }
    cout << "avergae waiting time= " << net_wait / n << endl;
    cout << "avergae turnaround time= " << net_turnaround / n << endl;
}
void fcfs(vector<Job> jobs)
{
    int time = 0, n = jobs.size(), index = 0, current = -1, nextIO = -1;
    sort(jobs.begin(), jobs.end(), JobComparator());
    queue<int> ready;
    queue<int> io;
    vector<Job> finished;
    while (finished.size() < n)
    {
        // cout << "time= " << time;
        if (nextIO != -1)
        {
            io.push(nextIO);
            nextIO = -1;
        }
        if (index < n && jobs[index].arrivalTime == time)
            ready.push(index++);
        if (current == -1 && !ready.empty())
        {
            current = ready.front();
            ready.pop();
            if (jobs[current].startTime == -1)
                jobs[current].startTime = time;
        }
        if (current != -1)
        {
            jobs[current].bursts[jobs[current].burstIndex]--;
            if (jobs[current].bursts[jobs[current].burstIndex] == 0)
            {
                jobs[current].burstIndex++;
                if (jobs[current].burstIndex == jobs[current].bursts.size())
                {
                    jobs[current].endTime = time;
                    finished.push_back(jobs[current]);
                }
                else
                    nextIO = current;
                current = -1;
            }
            // cout << ", CPU -> " << current;
        }
        if (io.size() > 0)
        {
            int curr_io = io.front();
            jobs[curr_io].bursts[jobs[curr_io].burstIndex]--;
            // cout << ", IO-> " << curr_io;
            if (jobs[curr_io].bursts[jobs[curr_io].burstIndex] == 0)
            {
                jobs[curr_io].burstIndex++;
                if (jobs[curr_io].burstIndex == jobs[curr_io].bursts.size())
                {
                    jobs[curr_io].endTime = time;
                    finished.push_back(jobs[curr_io]);
                }
                else
                    ready.push(curr_io);
                io.pop();
            }
        }
        // cout << ", finished= " << finished.size() << endl;
        time++;
    }
    int net_wait = 0, net_turnaround = 0;
    for (Job j : finished)
    {
        int wait = j.startTime - j.arrivalTime;
        int turnaround = j.endTime - j.arrivalTime;
        cout << "ID= " << j.id << ", arrival= " << j.arrivalTime << ", start= 
                                                                    " << j.startTime << ",
            end = " << j.endTime << ", wait = " << wait << ",
            turnaround = " << turnaround << endl;
            net_wait += wait;
        net_turnaround += turnaround;
    }
    cout << "average waiting time= " << net_wait / n << endl;
    cout << "average turnaround time= " << net_turnaround / n << endl;
}
void srtn(vector<Job> jobs)
{
    int time = 0, n = jobs.size(), index = 0, current = -1, nextIO = -1;
    sort(jobs.begin(), jobs.end(), JobComparator());
    vector<int> remaining_time(n, 0); // To track the remaining time of each
    job
        queue<int>
            io;
    vector<Job> finished;
    for (int i = 0; i < n; ++i)
        remaining_time[i] = accumulate(jobs[i].bursts.begin(),
                                       jobs[i].bursts.end(), 0);
    while (finished.size() < n)
    {
        if (nextIO != -1)
        {
            io.push(nextIO);
            nextIO = -1;
        }
        while (index < n && jobs[index].arrivalTime == time)
            index++;
        // Pick the job with the shortest remaining time
        current = -1;
        int min_remaining_time = INT_MAX;
        for (int i = 0; i < index; ++i)
        {
            if (remaining_time[i] > 0 && remaining_time[i] <
                                             min_remaining_time)
            {
                min_remaining_time = remaining_time[i];
                current = i;
            }
        }
        if (current != -1)
        {
            jobs[current].bursts[jobs[current].burstIndex]--;
            remaining_time[current]--;
            if (jobs[current].startTime == -1)
                jobs[current].startTime = time;
            if (jobs[current].bursts[jobs[current].burstIndex] == 0)
            {
                jobs[current].burstIndex++;
                if (jobs[current].burstIndex == jobs[current].bursts.size())
                {
                    jobs[current].endTime = time;
                    finished.push_back(jobs[current]);
                }
                else
                    nextIO = current;
            }
        }
        int curr_io = -1;
        if (!io.empty())
        {
            curr_io = io.front();
            jobs[curr_io].bursts[jobs[curr_io].burstIndex]--;
            if (jobs[curr_io].bursts[jobs[curr_io].burstIndex] == 0)
            {
                jobs[curr_io].burstIndex++;
                if (jobs[curr_io].burstIndex == jobs[curr_io].bursts.size())
                {
                    jobs[curr_io].endTime = time;
                    finished.push_back(jobs[curr_io]);
                }
                io.pop();
            }
        }
        time++;
    }
    int net_wait = 0, net_turnaround = 0;
    for (Job j : finished)
    {
        int wait = j.startTime - j.arrivalTime;
        int turnaround = j.endTime - j.arrivalTime;
        cout << "ID= " << j.id << ", arrival= " << j.arrivalTime << ", start= 
                                                                    " << j.startTime << ",
            end = " << j.endTime << ", wait = " << wait << ",
            turnaround = " << turnaround << endl;
            net_wait += wait;
        net_turnaround += turnaround;
    }
    cout << "average waiting time= " << net_wait / n << endl;
    cout << "average turnaround time= " << net_turnaround / n << endl;
}
int main()
{
    string filename = "jobs.txt";
    vector<Job> jobs = readJobProfiles(filename);
    cout << "Executing Round Robin Scheduling with time slice = " << TIMESLICE
         << endl;
    round_robin(jobs);
    cout << "Executing FCFS\n";
    fcfs(jobs);
    cout << "Executing SRTN\n";
    srtn(jobs);
    return 0;
}
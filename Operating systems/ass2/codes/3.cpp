#include <iostream>
#include <queue>
#include <cstdlib>
#include <ctime>
#include <unistd.h>
#include <pthread.h>
#include <semaphore.h>
using namespace std;
queue<string> buffer;
int TOTAL = 0;
const int BUFFER_SIZE = 25;
pthread_mutex_t bufferMutex = PTHREAD_MUTEX_INITIALIZER;
sem_t emptySlots, fullSlots;
void *producer(void *arg)
{
    int producerID = *(int *)arg;
    for (int i = 0; i < 10; i++)
    {
        int number = rand() % 20 + 1;
        string item = "p" + to_string(producerID) + (number < 10 ? "0" : "") +
                      to_string(number);
        sem_wait(&emptySlots);
        pthread_mutex_lock(&bufferMutex);
        buffer.push(item);
        cout << "Producer " << producerID << " produced " << item << endl;
        pthread_mutex_unlock(&bufferMutex);
        sem_post(&fullSlots);
        sleep(rand() % 3 + 1);
    }
    return nullptr;
}
void *consumer(void *arg)
{
    int consumerID = *(int *)arg;
    while (true)
    {
        sem_wait(&fullSlots);
        pthread_mutex_lock(&bufferMutex);
        if (buffer.empty())
        {
            pthread_mutex_unlock(&bufferMutex);
            sem_post(&fullSlots);
            break;
        }
        string item = buffer.front();
        buffer.pop();
        cout << "Consumer " << consumerID << " consumed " << item << endl;
        pthread_mutex_unlock(&bufferMutex);
        sem_post(&emptySlots);
        int number = stoi(item.substr(2));
        pthread_mutex_lock(&bufferMutex);
        TOTAL += number;
        pthread_mutex_unlock(&bufferMutex);
        sleep(rand() % 2 + 1);
    }
    return nullptr;
}
int main()
{
    srand(time(0));
    int p, c;
    cout << "Enter number of producers: ";
    cin >> p;
    cout << "Enter number of consumers: ";
    cin >> c;
    sem_init(&emptySlots, 0, BUFFER_SIZE);
    sem_init(&fullSlots, 0, 0);
    pthread_t producers[p], consumers[c];
    int producerIDs[p], consumerIDs[c];
    for (int i = 0; i < p; i++)
    {
        producerIDs[i] = i + 1;
        pthread_create(&producers[i], nullptr, producer, &producerIDs[i]);
    }
    for (int i = 0; i < c; i++)
    {
        consumerIDs[i] = i + 1;
        pthread_create(&consumers[i], nullptr, consumer, &consumerIDs[i]);
    }
    for (int i = 0; i < p; i++)
    {
        pthread_join(producers[i], nullptr);
    }
    for (int i = 0; i < c; i++)
    {
        sem_post(&fullSlots);
    }
    for (int i = 0; i < c; i++)
    {
        pthread_join(consumers[i], nullptr);
    }
    cout << "Final TOTAL = " << TOTAL << endl;
    // Clean up
    sem_destroy(&emptySlots);
    sem_destroy(&fullSlots);
    pthread_mutex_destroy(&bufferMutex);
    return 0;
}

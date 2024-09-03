#include<stdio.h>
#include<stdlib.h>
#include<math.h>

struct node{
    int info;
    int next;
};
struct List{                     //structure of linked list in form of array.
    int size;
    struct node *array;
};

struct List *create_list(int V){                //creating a List of array size V;
    struct List *newlist = (struct List*)malloc(sizeof(struct List));
    newlist->size = -1;
    newlist->array = (struct node*)malloc(V*sizeof(struct node));
    return newlist;
}

void insert(struct List *l,int data){           //function for inserting key.
    l->array[l->size+1].info = data;
    if(l->size == -1)
       l->array[l->size+1].next = -1;
    else
        l->array[l->size+1].next = l->array[l->size].info;     /*storing the next info of
                                                            previous info in next field of current List array.*/
    l->size++;             //incrementing the list size by 1.
}


void print_list(struct List *l){        //function to print the list.
    int i=0;
    struct node *a = l->array;
    while(i <= l->size){
        printf("->%d",a[i].info);
        i++;
    }
}

void rotate_list(struct List *l){       //function for 1 time rotation.
    int i = 0,p;
    p = l->array[i].info;
    while(i < l->size){
        l->array[i+1].next = l->array[i+1].info;
        l->array[i].info = l->array[i+1].info;
        i++;
    }
    l->array[0].next = -1;
    l->array[i].info = p;
}

void rotate_k_times(struct List *l){      //function for k time rotation.
    int i,k;
    printf("\nHow many times u want to rotate the list: ");
    scanf("%d",&k);
    printf("Your list after rotated %d times:\n\t",k);
    for(i=0;i<k;i++){
        rotate_list(l);
    }
}

int main(){
    struct List *list = create_list(12);
    insert(list,34);
    insert(list,5);
    insert(list,1);
    insert(list,4);
    insert(list,25);
    insert(list,10);
    printf("The linked list is:\n\t");
    print_list(list);

    rotate_k_times(list);
    print_list(list);
    return 0;
}

%{
#include <stdio.h>
int a_count = 0;
int b_count= 0;
%}

%%
(a) {a_count+=1;}
(b) {b_count+=1;}
\n  {printf("%d\n",a_count==b_count);
a_count=0;
b_count=0;
}
%%

int main(){
yylex();
return 0;
}

int yywrap(){
return 1;
}
#include "mainwindow.h"
#include "ui_mainwindow.h"
#include <QPainter>
#include <QPixmap>
#include <QColor>
#include <QTimer>
#include <QMouseEvent>
#include<bits/stdc++.h>
#include<QElapsedTimer>
#define PI 180

#define Delay delay(1)

using namespace std;

bool axis_clicked=false;
QVector<pair<int,int>> points;
MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    ui->workArea->setMouseTracking(true);
    ui->workArea->installEventFilter(this);

    QPixmap canvas = ui->workArea->pixmap(Qt::ReturnByValue);
    if (canvas.isNull()) {
        canvas = QPixmap(ui->workArea->size());
        canvas.fill(Qt::white);
        ui->workArea->setPixmap(canvas);
    }
}

MainWindow::~MainWindow()
{
    delete ui;
}

void MainWindow::delay(int ms){
    QEventLoop loop;
    QTimer::singleShot(ms, &loop, &QEventLoop::quit);
    loop.exec();
}

void MainWindow::colorPoint(int x, int y, int r, int g, int b, int penwidth=1) {
    QPixmap canvas=ui->workArea->pixmap();
    QPainter painter(&canvas);
    QPen pen=QPen(QColor(r,g,b),penwidth);
    painter.setPen(pen);
    painter.drawPoint(x, y);
    ui->workArea->setPixmap(canvas);
}

bool MainWindow::is_inside(int x,int y)
{
    if(MainWindow::polygon_points.size()==0)
    {
        return false;
    }
    int count=0;
    for(auto it:polygon_points)
    {
        if(it.second==y && it.first>x)
        {
            count++;
        }
    }
    qDebug()<<count;
    return count%2!=0;
}

void MainWindow::markBox(int x,int y,int r,int g,int b)
{
    int gridOffset = (ui->gridOffset->value()==0)?1:ui->gridOffset->value();
    int width = ui->workArea->width();
    int height = ui->workArea->height();
    int centerX=width/2;
    int centerY=height/2;
    clickedPoint.setX(x);
    clickedPoint.setY(y);
    int X=floor((x-centerX)*1.0/gridOffset);
    int Y=floor((centerY-y)*1.0/gridOffset);
    int calcX=X*gridOffset+centerX+gridOffset/2.0;
    int calcY=centerY-Y*gridOffset-gridOffset/2.0;
    colorPoint(calcX,calcY,r,g,b,gridOffset);
}
void MainWindow::on_showAxis_clicked() {
    axis_clicked=true;
    int width = ui->workArea->width();
    int height = ui->workArea->height();
    int centerX = width / 2;
    int centerY = height / 2;
    for (int x = 0; x < width; ++x) {
        markBox(x,centerY,255,0,0);
    }

    // Draw vertical axis
    for (int y = 0; y < height; ++y) {
        markBox(centerX, y, 255, 0, 0); // Black color
    }

}

void MainWindow::on_gridlines_clicked() {
    int gridOffset = ui->gridOffset->value();
    int width = ui->workArea->width();
    int height = ui->workArea->height();
    if (gridOffset <= 0) return; // Prevent invalid grid offset

    int centerX=width/2;
    int centerY=height/2;
    QPixmap canvas=ui->workArea->pixmap();
    QPainter painter(&canvas);
    for(int i =  0; (centerX+i<width && centerX-i>0) || (centerY+i<height && centerY-i>0); i+= gridOffset)
    {
        QPoint qp1 = QPoint(centerX + i, 0);
        QPoint qp2 = QPoint(centerX + i, height);
        QPoint qp3 = QPoint(centerX - i, 0);
        QPoint qp4 = QPoint(centerX - i, height);

        QPoint qp5 = QPoint(0, centerY + i);
        QPoint qp6 = QPoint(width, centerY + i);
        QPoint qp7 = QPoint(0, centerY-i);
        QPoint qp8 = QPoint(width, centerY - i);
        painter.drawLine(qp1, qp2);
        painter.drawLine(qp3, qp4);
        painter.drawLine(qp5, qp6);
        painter.drawLine(qp7, qp8);
    }

    ui->workArea->setPixmap(canvas);
}

bool MainWindow::eventFilter(QObject *watched, QEvent *event) {
    if (watched == ui->workArea && event->type() == QEvent::MouseMove) {
        QMouseEvent *cursor = static_cast<QMouseEvent*>(event);
        int x = cursor->pos().x();
        int y = cursor->pos().y();
        int gridOffset = (ui->gridOffset->value()==0)?1:ui->gridOffset->value();
        int width = ui->workArea->width();
        int height = ui->workArea->height();
        int centerX=width/2;
        int centerY=height/2;
        ui->x_coordinate->setText(QString::number(floor((x-centerX)*1.0/gridOffset)));
        ui->y_coordinate->setText(QString::number(floor((centerY-y)*1.0/gridOffset)));
        return true; // Event handled
    }
    if(watched == ui->workArea && event->type() == QEvent::MouseButtonPress){
        QMouseEvent *cursor = static_cast<QMouseEvent*>(event);
        int x = cursor->pos().x();
        int y = cursor->pos().y();
        markBox(x,y,0,0,255);
        points.push_back({x,y});
    }
    return QMainWindow::eventFilter(watched, event);
}


void MainWindow::draw_dda_line(int x1, int y1, int x2, int y2)
{
    int width = ui->workArea->width();
    int height = ui->workArea->height();
    int centerX = width / 2, centerY = height / 2;
    int gridOffset = ui->gridOffset->value();

    // Convert screen coordinates to grid coordinates
    float x1_coord = (float)(x1 - centerX) / gridOffset;
    float x2_coord = (float)(x2 - centerX) / gridOffset;
    float y1_coord = (float)(centerY - y1) / gridOffset;
    float y2_coord = (float)(centerY - y2) / gridOffset;

    // Calculate the difference between points and steps
    float dx = x2_coord - x1_coord;
    float dy = y2_coord - y1_coord;
    int steps = std::max(abs(dx), abs(dy));  // Maximum difference determines the number of steps

    // Calculate the increment for each step
    dx /= steps;
    dy /= steps;

    // Starting points
    float x = x1_coord;
    float y = y1_coord;

    // Plot each point in the DDA line
    for (int i = 0; i <= steps; i++)  // Ensure you plot all steps, including the last one
    {
        // Convert back to screen coordinates and round to the nearest integer
        MainWindow::polygon_points.push_back({x,y});
        // Plot the pixel with a specified color (e.g., green: 0,255,0)
        MainWindow::plotPixel(x, y, 0, 255, 0);

        // Increment x and y for the next point
        x+=dx;
        y+=dy;
    }
}


void MainWindow::on_dda_line_clicked()
{
    if(points.size()<2)return;
    draw_dda_line(points[0].first,points[0].second,points[1].first,points[1].second);
    points.clear();
}

void MainWindow::draw_bressenham_line(int x1, int y1, int x2, int y2)
{
    // Calculate the differences
    int dx = abs(x2 - x1);
    int dy = abs(y2 - y1);

    // Determine if we are stepping in the positive or negative direction
    int sx = (x1 < x2) ? 1 : -1;
    int sy = (y1< y2) ? 1 : -1;

    // Initial coordinates
    int x = x1;
    int y = y1;

    // Handle both slope cases |m| <= 1 and |m| > 1
    if (dx >= dy)
    {
        // Case 1: Slope is less than or equal to 1 (|m| <= 1)
        int p = 2 * dy - dx;
        for (int i = 0; i <= dx; i++)
        {
            // Convert grid coordinates back to screen coordinates and plot
            MainWindow::polygon_points.push_back({x,y});
            MainWindow::plotPixel(x,y,0,255,0);
            // Update p and x, y
            if (p >= 0)
            {
                y += sy;
                p -= 2 * dx;
            }
            p += 2 * dy;
            x += sx;
        }
    }
    else
    {
        // Case 2: Slope is greater than 1 (|m| > 1)
        int p = 2 * dx - dy;
        for (int i = 0; i <= dy; i++)
        {
            // Convert grid coordinates back to screen coordinates and plot
            MainWindow::polygon_points.push_back({x,y});
            MainWindow::plotPixel(x,y,0,255,0);

            // Update p and x, y
            if (p >= 0)
            {
                x += sx;
                p -= 2 * dy;
            }
            p += 2 * dx;
            y += sy;
        }
    }
}

void MainWindow::on_draw_bressenheim_line_clicked()
{
    if(points.size()<2)
    {
        points.clear();
        return;
    }
    int centerX=(ui->workArea->width())/2,centerY=(ui->workArea->height())/2;
    int gridOffset=(ui->gridOffset->value()<=0)?1:ui->gridOffset->value();
    int x_coord1=(points[0].first-centerX)/gridOffset,y_coord1=(centerY-points[0].second)/gridOffset;
    int x_coord2=(points[1].first-centerX)/gridOffset,y_coord2=(centerY-points[1].second)/gridOffset;
    MainWindow::draw_bressenham_line(x_coord1,y_coord1,x_coord2,y_coord2);
    points.clear();
}

void MainWindow::draw_polar_circle(int x_center,int y_center,int radius)
{
    int angle=(PI/4);
    int start=0;
    QElapsedTimer timer=QElapsedTimer();
    timer.start();
    for(;start<=angle;start++)
    {
        double angle_in_radian=(3.14/180)*start;
        int x=radius*cos(angle_in_radian);
        int y=radius*sin(angle_in_radian);
        plotPixel(x_center + x, y_center + y,0,0,255); // (x, y)
        Delay;
        plotPixel(x_center - x, y_center + y,0,0,255); // (-x, y)
        Delay;
        plotPixel(x_center + x, y_center - y,0,0,255); // (x, -y)
        Delay;
        plotPixel(x_center - x, y_center - y,0,0,255); // (-x, -y)
        Delay;
        plotPixel(x_center + y, y_center + x,0,0,255); // (y, x)
        Delay;
        plotPixel(x_center - y, y_center + x,0,0,255); // (-y, x)
        Delay;
        plotPixel(x_center + y, y_center - x,0,0,255); // (y, -x)
        Delay;
        plotPixel(x_center - y, y_center - x,0,0,255); // (-y, -x)
        Delay;
    }
    int time=timer.nsecsElapsed();
    ui->polartime->setText(QString::number(time/(100000)));
}
void MainWindow::on_draw_polar_circle_clicked()
{
    if(points.size()<1)return;
    int radius=ui->circleRadius->value();
    int width=ui->workArea->width();
    int height=ui->workArea->height();
    int centerX=width/2;
    int centerY=height/2;
    int gridOffset=(ui->gridOffset->value()<=0)?1:ui->gridOffset->value();
    if(radius==0)
    {
        markBox(points[0].first,points[0].second,0,0,255);
        return;
    }
    else
    {
        int xCenter=(points[0].first-centerX)/gridOffset;
        int yCenter=(centerY-points[0].second)/gridOffset;
        draw_polar_circle(xCenter,yCenter,radius);
    }
    points.clear();
}

void MainWindow::plotPixel(int x,int y,int r,int g,int b)
{
    MainWindow::polygon_points.push_back({x,y});
    int centerX=(ui->workArea->width())/2;
    int centerY=ui->workArea->height()/2;
    int gridOffset=ui->gridOffset->value();
    int newX=x*gridOffset+centerX;
    int newY=centerY-y*gridOffset;
    markBox(newX,newY,r,g,b);
    MainWindow::drawn_points.insert({x,y,r,g,b});
}
void MainWindow::draw_bressenham_circle(int x_center,int y_center,int radius)
{
    QElapsedTimer timer=QElapsedTimer();
    timer.start();
    int x = 0;
    int y = radius;
    int p = 1 - radius;

    // Plot the initial points
    plotPixel(x_center + x, y_center + y,0,255,0); // (x, y)
    Delay;
    plotPixel(x_center - x, y_center + y,0,255,0); // (-x, y)
    Delay;
    plotPixel(x_center + x, y_center - y,0,255,0); // (x, -y)
    Delay;
    plotPixel(x_center - x, y_center - y,0,255,0); // (-x, -y)
    Delay;
    plotPixel(x_center + y, y_center + x,0,255,0); // (y, x)
    Delay;
    plotPixel(x_center - y, y_center + x,0,255,0); // (-y, x)
    Delay;
    plotPixel(x_center + y, y_center - x,0,255,0); // (y, -x)
    Delay;
    plotPixel(x_center - y, y_center - x,0,255,0); // (-y, -x)
    Delay;
    while (x <= y) {
        x++;

        // Update the decision parameter
        if (p <= 0) {
            p = p+2*x+3;
        } else {
            y--;
            p = p + 2 * (x - y) + 5;
        }
        // Plot points in all octants
        plotPixel(x_center + x, y_center + y,0,255,0);
        Delay;
        plotPixel(x_center - x, y_center + y,0,255,0);
        Delay;
        plotPixel(x_center + x, y_center - y,0,255,0);
        Delay;
        plotPixel(x_center - x, y_center - y,0,255,0);
        Delay;
        plotPixel(x_center + y, y_center + x,0,255,0);
        Delay;
        plotPixel(x_center - y, y_center + x,0,255,0);
        Delay;
        plotPixel(x_center + y, y_center - x,0,255,0);
        Delay;
        plotPixel(x_center - y, y_center - x,0,255,0);
        Delay;
    }
    int time=timer.nsecsElapsed();
    ui->bressenham_time->setText(QString::number(time/100000));
}
void MainWindow::on_draw_bressenham_circle_clicked()
{
    if(points.size()<1)return;
    int centerX=(ui->workArea->width())/2,centerY=(ui->workArea->height())/2;
    int radius=ui->circleRadius->value();
    int gridOffset=(ui->gridOffset->value()<=0)?1:ui->gridOffset->value();
    int x_coord=(points[0].first-centerX)/gridOffset,y_coord=(centerY-points[0].second)/gridOffset;
    draw_bressenham_circle(x_coord,y_coord,radius);
    points.clear();
}

void MainWindow::draw_polar_ellipse(int x_center,int y_center,int a,int b)
{
    QElapsedTimer timer=QElapsedTimer();
    timer.start();
    plotPixel(x_center,y_center+b,0,0,255);
    plotPixel(x_center,y_center-b,0,0,255);
    for(int theta=0;theta<=PI/2;theta++)
    {
        double x1=a*cos((double)theta*3.14/180);
        double y1=b*sin((double)theta*3.14/180);
        int x=x1,y=y1;
        if(x1!=(double)x)
        {
            x=ceil(x1);
        }
        if(y1!=(double)y)
        {
            y=ceil(y1);
        }
        plotPixel(x_center+x,y_center+y,0,0,255);
        Delay;
        plotPixel(x_center-x,y_center+y,0,0,255);
        Delay;
        plotPixel(x_center-x,y_center-y,0,0,255);
        Delay;
        plotPixel(x_center+x,y_center-y,0,0,255);
        Delay;
    }
    int time=timer.nsecsElapsed();
    ui->polar_ellipse_time->setText(QString::number(time/100000));
}
void MainWindow::on_draw_polar_ellipse_clicked()
{
    if(points.size()<1)return;
    int centerX=(ui->workArea->width())/2,centerY=(ui->workArea->height())/2;
    int a=ui->h_radius->value();
    int b=ui->v_radius->value();
    int gridOffset=(ui->gridOffset->value()<=0)?1:ui->gridOffset->value();
    int x_coord=(points[0].first-centerX)/gridOffset,y_coord=(centerY-points[0].second)/gridOffset;
    draw_polar_ellipse(x_coord,y_coord,a,b);
    points.clear();
}

void MainWindow::draw_bressenham_ellipse(int x_center,int y_center,int a,int b)
{
    QElapsedTimer timer=QElapsedTimer();
    timer.start();
    int x=0,y=b;
    double d1=b*b-a*a*b+(0.25*a*a);
    while(b*b*x<a*a*y)
    {
        plotPixel(x_center+x,y_center+y,0,255,0);
        Delay;
        plotPixel(x_center-x,y_center+y,0,255,0);
        Delay;
        plotPixel(x_center-x,y_center-y,0,255,0);
        Delay;
        plotPixel(x_center+x,y_center-y,0,255,0);
        Delay;
        if(d1<0)
        {
            d1+=b*b*(1+2*x);
        }
        else
        {
            d1+=b*b*(2*x+3)+a*a*(2-2*y);
            y--;
        }
        x++;
    }
    double d2=b*b*(x+0.5)*(x-0.5)+a*a*(y-1)*(y-1)-a*a*b*b;
    while(y>=0)
    {
        if(d2<0)
        {
            d2+=b*b*(2*x+2)+a*a*(-2*y+3);
            x++;
        }
        else
        {
            d2+=a*a*(-2*y+3);
        }
        y--;
        plotPixel(x_center+x,y_center+y,0,255,0);
        Delay;
        plotPixel(x_center-x,y_center+y,0,255,0);
        Delay;
        plotPixel(x_center-x,y_center-y,0,255,0);
        Delay;
        plotPixel(x_center+x,y_center-y,0,255,0);
        Delay;
    }
    int time=timer.nsecsElapsed();
    ui->bressenham_ellipse_time->setText(QString::number(time/100000));
}

void MainWindow::flood_fill(int x,int y,int r,int g,int b,set<pair<int,int>> &st,int max_x,int min_x,int max_y,int min_y)
{
    Delay;
    plotPixel(x,y,r,g,b);
    int del_x[]={1,0,-1,0};
    int del_y[]={0,1,0,-1};
    st.insert({x,y});
    for(int k=0;k<4;k++)
    {
        int newX=x+del_x[k],newY=y+del_y[k];
        //if(newX<min_x || newX>max_x || newY<min_y || newY>max_y)continue;
        bool f=false;
        for(auto it:MainWindow::polygon_points)
        {
            if(it.first==newX && it.second==newY)
            {
                f=true;
                break;
            }
        }
        if(f)continue;
        if(st.find({newX,newY})==st.end())
        {
            MainWindow::flood_fill(newX,newY,r,g,b,st,max_x,min_x,max_y,min_y);
        }
    }
}
void MainWindow::on_draw_bressenham_ellipse_clicked()
{
    if(points.size()<1)return;
    int centerX=(ui->workArea->width())/2,centerY=(ui->workArea->height())/2;
    int a=ui->h_radius->value();
    int b=ui->v_radius->value();
    int gridOffset=(ui->gridOffset->value()<=0)?1:ui->gridOffset->value();
    int x_coord=(points[0].first-centerX)/gridOffset,y_coord=(centerY-points[0].second)/gridOffset;
    draw_bressenham_ellipse(x_coord,y_coord,a,b);
    points.clear();
}


void MainWindow::on_redraw_shape_clicked()
{
    QPixmap canvas = ui->workArea->pixmap(Qt::ReturnByValue);
    canvas.fill(Qt::white);
    ui->workArea->setPixmap(canvas);
    // Redraw the gridlines and axes
    MainWindow::on_gridlines_clicked();
    if(axis_clicked)MainWindow::on_showAxis_clicked();

    // Check if there are drawn points to display
    if (!drawn_points.empty())
    {
        for (const auto& point : drawn_points)
        {
            // Assuming plotPixel is a method that handles drawing
            MainWindow::plotPixel(point[0], point[1], point[2], point[3], point[4]);
        }
    }

}



void MainWindow::on_flood_fill_clicked()
{
    if(points.size()==0)
    {
        return;
    }
    int centerX=ui->workArea->width()/2,centerY=ui->workArea->height()/2;
    int gridOffset=ui->gridOffset->value();
    int x=(points[0].first-centerX)/gridOffset,y=(centerY-points[0].second)/gridOffset;
    set<pair<int,int>> st;
    int max_x=polygon_points[0].first,min_y=polygon_points[0].second,max_y=polygon_points[0].second,min_x=polygon_points[0].first;
    for(auto it:polygon_points)
    {
        max_x=max(max_x,it.first);
        min_x=min(min_y,it.first);
        max_y=max(max_y,it.second);
        min_y=min(min_y,it.second);
    }
    MainWindow::flood_fill(x,y,180,250,180,st,max_x,min_x,max_y,min_y);
    points.clear();
}


void MainWindow::on_draw_polygon_clicked()
{
    if(polygon_points.size()>0)
    {
        polygon_points.clear();
    }
    if(vertices.size()>0)
    {
        vertices.clear();
    }
    if(points.size()<2)
    {
        return;
    }
    else
    {
        int n=points.size();
        for(int i=0;i<n;i++)
        {
            int x1=points[i].first;
            int y1=points[i].second;
            int x2=points[(i+1)%n].first;
            int y2=points[(i+1)%n].second;
            int centerX=(ui->workArea->width())/2,centerY=(ui->workArea->height())/2;
            int gridOffset=(ui->gridOffset->value()<=0)?1:ui->gridOffset->value();
            int x_coord1=(x1-centerX)/gridOffset,y_coord1=(centerY-y1)/gridOffset;
            int x_coord2=(x2-centerX)/gridOffset,y_coord2=(centerY-y2)/gridOffset;
            MainWindow::draw_bressenham_line(x_coord1,y_coord1,x_coord2,y_coord2);
            MainWindow::vertices.push_back({x_coord1,y_coord1});
            MainWindow::vertices.push_back({x_coord2,y_coord2});
        }
        points.clear();
    }
}

void MainWindow::boundary_fill(int x,int y,int r,int g,int b,set<pair<int,int>> &st,int max_x,int min_x,int max_y,int min_y)
{
    Delay;
    plotPixel(x,y,r,g,b);
    int del_x[]={1,0,-1,0};
    int del_y[]={0,1,0,-1};
    st.insert({x,y});
    for(int k=0;k<4;k++)
    {
        int newX=x+del_x[k],newY=y+del_y[k];
        if(newX<min_x || newX>max_x || newY<min_y || newY>max_y)continue;
        bool f=false;
        for(auto it:MainWindow::polygon_points)
        {
            if(it.first==newX && it.second==newY)
            {
                f=true;
                break;
            }
        }
        if(f)continue;
        if(st.find({newX,newY})==st.end())
        {
            MainWindow::boundary_fill(newX,newY,r,g,b,st,max_x,min_x,max_y,min_y);
        }
    }
}
void MainWindow::on_boundary_fill_clicked()
{
    if(points.size()==0)
    {
        return;
    }
    int centerX=ui->workArea->width()/2,centerY=ui->workArea->height()/2;
    int gridOffset=ui->gridOffset->value();
    int x=(points[0].first-centerX)/gridOffset,y=(centerY-points[0].second)/gridOffset;
    set<pair<int,int>> st;
    for(auto it:MainWindow::polygon_points)
    {
        st.insert(it);
    }
    int max_x=polygon_points[0].first,min_y=polygon_points[0].second,max_y=polygon_points[0].second,min_x=polygon_points[0].first;
    for(auto it:polygon_points)
    {
        max_x=max(max_x,it.first);
        min_x=min(min_y,it.first);
        max_y=max(max_y,it.second);
        min_y=min(min_y,it.second);
    }
    MainWindow::boundary_fill(x,y,180,250,180,st,max_x,min_x,max_y,min_y);
    points.clear();
}

// void MainWindow::on_fill_by_scanline_clicked() {
//     int y_max=polygon_points[0].second,y_min=polygon_points[0].second;
//     for(auto it:polygon_points)
//     {
//         y_max=max(y_max,it.second);
//         y_min=min(y_min,it.second);
//     }
//     for(int y=y_min;y<=y_max;y++)
//     {
//         QVector<int> x_intersections;
//         for(auto p:polygon_points)
//         {
//             if(p.second==y)
//             {
//                 x_intersections.push_back(p.first);
//             }
//         }
//         sort(x_intersections.begin(),x_intersections.end());
//         for(int i=0;i<x_intersections.size()-1;i++)
//         {
//             Delay;
//             for(int x=x_intersections[i]+1;x<x_intersections[i+1];x++)
//             {
//                 plotPixel(x,y,180,250,180);
//             }
//         }
//     }
//     points.clear();
// }


// Struct for storing edge information
typedef struct edgebucket {
    int ymax;           // Maximum y-coordinate of the edge
    float xofymin;      // x-coordinate of the lower vertex
    float slopeinverse; // Inverse slope of the edge
} EdgeBucket;

typedef struct edgetabletup {
    int countEdgeBucket;  // Number of edges in this scanline
    EdgeBucket buckets[maxVer];  // Array of edge buckets for this scanline
} EdgeTableTuple;

EdgeTableTuple EdgeTable[maxHt], ActiveEdgeTuple;  // Global EdgeTable and ActiveEdgeTuple

// Initialize the EdgeTable and ActiveEdgeTuple
void MainWindow::initEdgeTable() {
    for (int i = 0; i < maxHt; i++) {
        EdgeTable[i].countEdgeBucket = 0;
    }
    ActiveEdgeTuple.countEdgeBucket = 0;
}

// Sort the edges in the active edge table
void insertionSort(EdgeTableTuple *ett) {
    int i, j;
    EdgeBucket temp;

    for (i = 1; i < ett->countEdgeBucket; i++) {
        temp = ett->buckets[i];
        j = i - 1;

        // Sort based on x coordinate
        while (j >= 0 && temp.xofymin < ett->buckets[j].xofymin) {
            ett->buckets[j + 1] = ett->buckets[j];
            j--;
        }
        ett->buckets[j + 1] = temp;
    }
}

// Store an edge into the edge table at the given scanline
void storeEdgeInTuple(EdgeTableTuple *receiver, int ymax, int xofymin, float slopeinverse) {
    receiver->buckets[receiver->countEdgeBucket].ymax = ymax;
    receiver->buckets[receiver->countEdgeBucket].xofymin = xofymin;
    receiver->buckets[receiver->countEdgeBucket].slopeinverse = slopeinverse;
    receiver->countEdgeBucket++;

    // Sort the newly inserted edges
    insertionSort(receiver);
}

// Store edge between two points into the global EdgeTable
void MainWindow::storeEdgeInTable(int x1, int y1, int x2, int y2) {
    float slopeinverse;
    int ymaxTS, xwithyminTS, scanline;

    if (y1 == y2) return; // Ignore horizontal edges

    if (x2 == x1) {
        slopeinverse = 0.0;  // Vertical line
    } else {
        float slope = (float)(y2 - y1) / (x2 - x1);
        slopeinverse = 1.0 / slope;
    }

    // Ensure y1 is the lower point and y2 is the upper point
    if (y1 > y2) {
        ymaxTS = y1;
        xwithyminTS = x2;
        scanline = y2;
    } else {
        ymaxTS = y2;
        xwithyminTS = x1;
        scanline = y1;
    }

    storeEdgeInTuple(&EdgeTable[scanline], ymaxTS, xwithyminTS, slopeinverse);
}

// Remove edges that have been fully processed (i.e., reached their ymax)
void removeEdgeByYmax(EdgeTableTuple *Tup, int y) {
    for (int i = 0; i < Tup->countEdgeBucket; i++) {
        if (Tup->buckets[i].ymax == y) {
            for (int j = i; j < Tup->countEdgeBucket - 1; j++) {
                Tup->buckets[j] = Tup->buckets[j + 1];
            }
            Tup->countEdgeBucket--;  // Reduce the number of active edges
            i--;
        }
    }
}

// Update x coordinates of edges in the active edge table for the next scanline
void updatexbyslopeinv(EdgeTableTuple *Tup) {
    for (int i = 0; i < Tup->countEdgeBucket; i++) {
        Tup->buckets[i].xofymin += Tup->buckets[i].slopeinverse;
    }
}

// Scanline fill function
void MainWindow::on_fill_by_scanline_clicked() {
    // Initialize EdgeTable and ActiveEdgeTuple
    initEdgeTable();

    // Populate the edge table with polygon edges
    for (size_t i = 0; i < polygon_points.size(); i++) {
        int x1 = polygon_points[i].first;
        int y1 = polygon_points[i].second;
        int x2 = polygon_points[(i + 1) % polygon_points.size()].first;
        int y2 = polygon_points[(i + 1) % polygon_points.size()].second;

        storeEdgeInTable(x1, y1, x2, y2);
    }

    // Scanline filling
    for (int y = 0; y < maxHt; y++) {
        // Transfer edges from EdgeTable to ActiveEdgeTuple for this scanline
        for (int j = 0; j < EdgeTable[y].countEdgeBucket; j++) {
            storeEdgeInTuple(&ActiveEdgeTuple, EdgeTable[y].buckets[j].ymax,
                             EdgeTable[y].buckets[j].xofymin, EdgeTable[y].buckets[j].slopeinverse);
        }

        // Remove edges that are no longer active
        removeEdgeByYmax(&ActiveEdgeTuple, y);

        // Sort ActiveEdgeTuple based on xofymin
        insertionSort(&ActiveEdgeTuple);

        // Fill between pairs of x coordinates
        for (int j = 0; j < ActiveEdgeTuple.countEdgeBucket; j += 2) {
            if (j + 1 < ActiveEdgeTuple.countEdgeBucket) {
                int x1 = (int)ActiveEdgeTuple.buckets[j].xofymin;
                int x2 = (int)ActiveEdgeTuple.buckets[j + 1].xofymin;

                for (int x = x1; x <= x2; x++) {
                    plotPixel(x, y, 180, 250, 180);  // Fill with color
                }
            }
        }

        // Update x values in ActiveEdgeTuple for the next scanline
        updatexbyslopeinv(&ActiveEdgeTuple);
    }

    // Clear the points after filling
    points.clear();
}

#include "mainwindow.h"
#include "ui_mainwindow.h"
#include <QPainter>
#include <QPixmap>
#include <QColor>
#include <QTimer>
#include <QMouseEvent>
#include<bits/stdc++.h>
#include<QElapsedTimer>
#include <QDebug>
#include<cmath>
#include <utility>

#define maxHt 1000
#define maxVt 1000
#define PI 180
#define Delay delay(1)

using namespace std;

QVector<pair<int,int>> points;
QVector<pair<int,int>> line_endpoints;
QVector<QVector<pair<int,int>>> clippedPoints;
QVector<pair<int,int>> window_points;

bool axis_clicked=false;
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
        int height=ui->workArea->height();
        int width=ui->workArea->width();
        int centerX=width/2;
        int centerY=height/2;
        int gridOffset=ui->gridOffset->value();
        x=floor((x-centerX)*1.0/gridOffset);
        y=floor((centerY-y)*1.0/gridOffset);
        points.push_back({x,y});
    }
    return QMainWindow::eventFilter(watched, event);
}


void MainWindow::draw_dda_line(int x1, int y1, int x2, int y2,int r,int g,int b)
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
        MainWindow::plotPixel(x, y, r,g,b);

        // Increment x and y for the next point
        x+=dx;
        y+=dy;
    }
}


void MainWindow::on_dda_line_clicked()
{
    if(points.size()<2)return;
    draw_dda_line(points[0].first,points[0].second,points[1].first,points[1].second,0,255,0);
    points.clear();
}

void MainWindow::draw_bressenham_line(int x1, int y1, int x2, int y2,int r,int g,int b)
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
            MainWindow::plotPixel(x,y,r,g,b);
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
    int x_coord1=points[0].first;
    int y_coord1=points[0].second;
    int x_coord2=points[1].first;
    int y_coord2=points[1].second;
    MainWindow::draw_bressenham_line(x_coord1,y_coord1,x_coord2,y_coord2,0,255,0);
    line_endpoints.push_back({x_coord1,y_coord1});
    line_endpoints.push_back({x_coord2,y_coord2});
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
    if(radius==0)
    {
        plotPixel(points[0].first,points[0].second,0,0,255);
        return;
    }
    else
    {
        int xCenter=points[0].first;
        int yCenter=points[0].second;
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
    int a=ui->h_radius->value();
    int b=ui->v_radius->value();
    int x_coord=points[0].first,y_coord=points[0].second;
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

void MainWindow::flood_fill(int x, int y, int r, int g, int b,set<pair<int,int>> &st){
    // Check bounds
    Delay;

    // Set the initial pixel to the fill color
    plotPixel(x, y, r, g, b);
    st.insert({x,y});
    // Recursive flood fill implementation for 4-connected pixels
    int del_x[] = {1, 0, -1, 0};
    int del_y[] = {0, 1, 0, -1};

    for (int k = 0; k < 4; k++) {
        int newX = x + del_x[k];
        int newY = y + del_y[k];
        bool f=false;
        if((newX==0 || newY==0) && axis_clicked)
        {
            f=true;
        }
        if(f)
        {
            continue;
        }
        if(st.find({newX,newY})==st.end())
        {
            flood_fill(newX,newY,r,g,b,st);
        }
    }

    // Optional 8-connected flood fill if the checkbox is checked
    if (ui->checkBox->isChecked()) {
        int diag_x[] = {1, 1, -1, -1};
        int diag_y[] = {1, -1, -1, 1};

        for (int k = 0; k < 4; k++) {
            int newX = x + diag_x[k];
            int newY = y + diag_y[k];
            bool f=false;
            if((newX==0 || newY==0) && axis_clicked)
            {
                f=true;
            }
            if(f)
            {
                continue;
            }
            if(st.find({newX,newY})==st.end())
            {
                flood_fill(newX,newY,r,g,b,st);
            }
        }
    }
}


void MainWindow::on_draw_bressenham_ellipse_clicked()
{
    if(points.size()<1)return;
    int a=ui->h_radius->value();
    int b=ui->v_radius->value();
    int x_coord=points[0].first,y_coord=points[0].second;
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
    int x=points[0].first,y=points[0].second;
    set<pair<int,int>> st(polygon_points.begin(),polygon_points.end());
    MainWindow::flood_fill(x,y,180,250,180,st);
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
            MainWindow::draw_bressenham_line(x1,y1,x2,y2,0,255,0);
            MainWindow::vertices.push_back({x1,y1});
        }
        points.clear();
    }
}

void MainWindow::boundary_fill(int x,int y,int r,int g,int b,set<pair<int,int>> &st)
{
    Delay;
    plotPixel(x,y,r,g,b);
    int del_x[]={1,0,-1,0};
    int del_y[]={0,1,0,-1};
    st.insert({x,y});
    for(int k=0;k<4;k++)
    {
        int newX=x+del_x[k],newY=y+del_y[k];
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
            MainWindow::boundary_fill(newX,newY,r,g,b,st);
        }
    }
    if(ui->checkBox->isChecked())
    {
        int diag_x[]={1,1,-1,-1};
        int diag_y[]={1,-1,-1,1};
        for(int k=0;k<4;k++)
        {
            int newX=x+diag_x[k],newY=y+diag_y[k];
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
                MainWindow::boundary_fill(newX,newY,r,g,b,st);
            }
        }

    }
}
void MainWindow::on_boundary_fill_clicked()
{
    if(points.size()==0)
    {
        return;
    }
    int x=points[0].first,y=points[0].second;
    set<pair<int,int>> st;
    for(auto it:MainWindow::polygon_points)
    {
        st.insert(it);
    }
    MainWindow::boundary_fill(x,y,180,250,180,st);
    points.clear();
}

void MainWindow::on_fill_by_scanline_clicked() {
    int y_max = INT_MIN, y_min = INT_MAX;

    // Step 1: Find the maximum and minimum y-values of the polygon
    for (const auto &vertex : vertices) {
        y_max = std::max(y_max, vertex.second);
        y_min = std::min(y_min, vertex.second);
    }

    // Step 2: Iterate over each scanline from y_min to y_max
    for (int y = y_min; y <= y_max; y++) {
        QVector<int> x_intersections;

        // Step 3: Calculate intersections of polygon edges with the current scanline
        for (int i = 0; i < vertices.size(); i++) {
            // Get the current edge (vertex i to vertex i+1)
            std::pair<int, int> p1 = vertices[i];
            std::pair<int, int> p2 = vertices[(i + 1) % vertices.size()];  // Wrap around for the last vertex

            // Ensure p1.y < p2.y for consistent processing
            if (p1.second > p2.second) std::swap(p1, p2);

            // Check if the scanline intersects the edge (exclusive of the upper vertex to avoid double-counting)
            if (y > p1.second && y <= p2.second) {
                // Use integer arithmetic to avoid floating-point errors
                int dy = p2.second - p1.second;
                int dx = p2.first - p1.first;
                int x_intersection = p1.first + ((y - p1.second) * dx) / dy;

                x_intersections.push_back(x_intersection);
            }
        }

        // Step 4: Sort the x-intersections
        std::sort(x_intersections.begin(), x_intersections.end());

        // Step 5: Fill between pairs of intersections
        for (int i = 0; i < x_intersections.size() - 1; i += 2) {
            int x_start = x_intersections[i];
            int x_end = x_intersections[i + 1];

            // Fill the horizontal line between x_start and x_end (inclusive of x_start, exclusive of x_end)
            for (int x = x_start; x <= x_end; x++) {
                Delay;
                plotPixel(x, y, 180, 250, 180);  // Fill color (R, G, B)
            }
        }
    }
}

void MainWindow::on_clear_canvas_clicked()
{
    drawn_points.clear();
    points.clear();
    line_endpoints.clear();
    vertices.clear();
    QPixmap canvas=ui->workArea->pixmap(Qt::ReturnByValue);
    canvas.fill(Qt::white);
    ui->workArea->setPixmap(canvas);
    MainWindow::on_gridlines_clicked();
    if(axis_clicked)MainWindow::on_showAxis_clicked();
}

QVector<int> multiply(QVector<QVector<double>> &matrix,QVector<int> &vec)
{
    QVector<int> ans;
    for(int i=0;i<vec.size();i++)
    {
        int sum=0;
        for(int j=0;j<vec.size();j++)
        {
            sum+=vec[j]*matrix[i][j];
        }
        ans.push_back(sum);
    }
    // QDebug()<<ans;
    return ans;
}
QVector<int> translate(QVector<int> &vec,int x,int y)
{
    QVector<QVector<double>> matrix(vec.size(),QVector<double>(vec.size(),0));
    matrix[0][vec.size()-1]=x;
    matrix[1][vec.size()-1]=y;
    matrix[2][vec.size()-1]=1;
    for(int i=0;i<vec.size();i++)
    {
        matrix[i][i]=1;
    }
    return multiply(matrix,vec);
}

QVector<int> rotateBy(int theta, QVector<int> &v)
{
    // Create a 2x2 rotation matrix for the angle theta
    QVector<QVector<double>> matrix(3, QVector<double>(3, 0));
    matrix[2][2] = 1;  // Homogeneous coordinate for 2D transformations

    double radian = ((double)theta * M_PI) / 180.0;
    matrix[0][0] = cos(radian);
    matrix[0][1] = -sin(radian);
    matrix[1][0] = sin(radian);
    matrix[1][1] = cos(radian);

    // Perform matrix multiplication
    return multiply(matrix, v);
}

void MainWindow::on_translate_clicked()
{
    int along_x=ui->along_x->value();
    int along_y=ui->along_y->value();
    QVector<QVector<int>> temp;
    for(auto it:drawn_points)
    {
        temp.push_back(it);
    }
    drawn_points.clear();
    for(int i=0;i<temp.size();i++)
    {
        QVector<int> v;
        v.push_back(temp[i][0]);
        v.push_back(temp[i][1]);
        v.push_back(1);
        QVector<int> v2=translate(v,along_x,along_y);
        temp[i][0]=v2[0];
        temp[i][1]=v2[1];
    }
    for(auto it:temp)
    {
        drawn_points.insert(it);
    }
    MainWindow::on_redraw_shape_clicked();
}


void MainWindow::on_rotate_clicked()
{
    int theta=ui->angle->value();
    QVector<QVector<int>> temp;
    for(auto it:vertices)
    {
        temp.push_back({it.first,it.second});
    }
    vertices.clear();
    drawn_points.clear();
    on_clear_canvas_clicked();
    for(int i=0;i<temp.size();i++)
    {
        QVector<int> v={temp[i][0],temp[i][1],1};
        QVector<int> v2=rotateBy(theta,v);
        temp[i][0]=v2[0];
        temp[i][1]=v2[1];
    }
    for(auto it:temp)
    {
        vertices.push_back({it[0],it[1]});
    }
    int n=vertices.size();
    for(int i=0;i<n;i++)
    {
        draw_bressenham_line(vertices[i].first,vertices[i].second,vertices[(i+1)%n].first,vertices[(i+1)%n].second,0,255,0);
    }
}

QVector<int> shear(float shear_x,float shear_y,QVector<int> &v)
{
    QVector<QVector<double>> matrix(3,QVector<double>(3,0));
    matrix[0][0]=1;
    matrix[0][1]=shear_x;
    matrix[1][0]=shear_y;
    matrix[1][1]=1;
    matrix[2][2]=1;
    return multiply(matrix,v);
}

void MainWindow::on_apply_shear_clicked()
{
    float shear_x=ui->shear_x->value();
    float shear_y=ui->shear_y->value();
    QVector<pair<int,int>> temp;
    for(auto it:vertices)
    {
        temp.push_back(it);
    }
    vertices.clear();
    for(int i=0;i<temp.size();i++)
    {
        QVector<int> v={temp[i].first,temp[i].second,1};
        QVector<int> v2=shear(shear_x,shear_y,v);
        temp[i]={v2[0],v2[1]};
    }
    for(auto it:temp)
    {
        vertices.push_back(it);
    }
    int n=vertices.size();
    MainWindow::on_clear_canvas_clicked();
    for(int i=0;i<n;i++)
    {
        int x1=vertices[i].first;
        int x2=vertices[(i+1)%n].first;
        int y1=vertices[i].second;
        int y2=vertices[(i+1)%n].second;
        draw_bressenham_line(x1,y1,x2,y2,0,255,0);
    }
}

QVector<int> x_reflect(QVector<int> &v)
{
    QVector<QVector<double>> matrix(3,QVector<double>(3,0));
    matrix[0][0]=1;
    matrix[1][1]=-1;
    matrix[2][2]=1;
    return multiply(matrix,v);
}

QVector<int> y_reflect(QVector<int> &v)
{
    QVector<QVector<double>> matrix(3,QVector<double>(3,0));
    matrix[0][0]=-1;
    matrix[1][1]=1;
    matrix[2][2]=1;
    return multiply(matrix,v);
}

void MainWindow::on_xaxis_reflect_clicked()
{
    QVector<QVector<int>> temp;
    for(auto it:drawn_points)
    {
        temp.push_back(it);
    }
    drawn_points.clear();
    for(int i=0;i<temp.size();i++)
    {
        QVector<int> v={temp[i][0],temp[i][1],1};
        QVector<int> v2=x_reflect(v);
        temp[i][0]=v2[0];
        temp[i][1]=v2[1];
    }
    for(auto it:temp)
    {
        drawn_points.insert(it);
    }
    on_redraw_shape_clicked();
}

void MainWindow::on_yaxis_reflect_clicked()
{
    QVector<QVector<int>> temp;
    for(auto it:drawn_points)
    {
        temp.push_back(it);
    }
    drawn_points.clear();
    for(int i=0;i<temp.size();i++)
    {
        QVector<int> v={temp[i][0],temp[i][1],1};
        QVector<int> v2=y_reflect(v);
        temp[i][0]=v2[0];
        temp[i][1]=v2[1];
    }
    for(auto it:temp)
    {
        drawn_points.insert(it);
    }
    on_redraw_shape_clicked();
}

QVector<int> scale(int scale_x,int scale_y,QVector<int> &v)
{
    QVector<QVector<double>> matrix(3,QVector<double>(3,0));
    matrix[0][0]=scale_x;
    matrix[0][1]=0;
    matrix[1][0]=0;
    matrix[1][1]=scale_y;
    matrix[1][1]=1;
    return multiply(matrix,v);
}
void MainWindow::on_scale_clicked()
{
    int scale_x=ui->scale_factor_x->value();
    int scale_y=ui->scale_factor_y->value();
    QVector<pair<int,int>> temp;
    for(auto it:vertices)
    {
        temp.push_back(it);
    }
    vertices.clear();
    for(int i=0;i<temp.size();i++)
    {
        QVector<int> v={temp[i].first,temp[i].second,1};
        QVector<int> v2=scale(scale_x,scale_y,v);
        temp[i]={v2[0],v2[1]};
    }
    for(auto it:temp)
    {
        vertices.push_back(it);
    }
    int n=vertices.size();
    MainWindow::on_clear_canvas_clicked();
    for(int i=0;i<n;i++)
    {
        int x1=vertices[i].first;
        int x2=vertices[(i+1)%n].first;
        int y1=vertices[i].second;
        int y2=vertices[(i+1)%n].second;
        draw_bressenham_line(x1,y1,x2,y2,0,255,0);
    }
}

enum OutCode { INSIDE = 0, LEFT = 1, RIGHT = 2, BOTTOM = 4, TOP = 8 };

// Function to compute the outcode for a given point (x, y)
OutCode computeOutCode(int x, int y, int x_min, int y_min, int x_max, int y_max) {
    OutCode code = INSIDE;

    if (x < x_min) code = static_cast<OutCode>(code | LEFT);
    else if (x > x_max) code = static_cast<OutCode>(code | RIGHT);
    if (y < y_min) code = static_cast<OutCode>(code | BOTTOM);
    else if (y > y_max) code = static_cast<OutCode>(code | TOP);

    return code;
}

// Main function to clip a line according to the Sutherland-Cohen algorithm
void MainWindow::on_sutherlandcohenclip_clicked() {
    int x1, y1, x2, y2; // The endpoints of the line to be clipped
    int x_min, y_min, x_max, y_max; // The bounds of the clipping window

    // Define your line endpoints and clipping window here (example values)
    sort(line_endpoints.begin(),line_endpoints.end());
    x1 = line_endpoints[0].first; y1 = line_endpoints[0].second;
    x2 = line_endpoints[1].first; y2 = line_endpoints[1].second;
    x_min =window_points[0].first; y_min = window_points[0].second;
    x_max = window_points[1].first; y_max = window_points[1].second;
    window_points.clear();
    // Get the outcodes for the initial endpoints
    qDebug()<<x_min<<y_min<<x_max<<y_max;
    qDebug()<<x1<<y1<<x2<<y2;
    on_clear_canvas_clicked();
    draw_bressenham_line(x_min,y_min,x_max,y_min,0,255,0);
    draw_bressenham_line(x_max,y_min,x_max,y_max,0,255,0);
    draw_bressenham_line(x_max,y_max,x_min,y_max,0,255,0);
    draw_bressenham_line(x_min,y_max,x_min,y_min,0,255,0);
    for(auto it:clippedPoints)
    {
        int clipped_x1=it[0].first;
        int clipped_y1=it[0].second;
        int clipped_x2=it[1].first;
        int clipped_y2=it[1].second;
        draw_bressenham_line(clipped_x1,clipped_y1,clipped_x2,clipped_y2,0,255,0);
    }
    OutCode outcode1 = computeOutCode(x1, y1, x_min, y_min, x_max, y_max);
    OutCode outcode2 = computeOutCode(x2, y2, x_min, y_min, x_max, y_max);

    bool accept = false;

    while (true) {
        if (!(outcode1 | outcode2)) {
            // Both endpoints are inside the rectangle
            accept = true;
            break;
        } else if (outcode1 & outcode2) {
            // Both endpoints share an outside zone, trivially reject
            break;
        } else {
            // Calculate the line segment to clip from an outside point to an intersection with the clip edge
            int x, y;

            // Determine which endpoint is outside the clipping area
            OutCode outcodeOut = outcode1 ? outcode1 : outcode2;

            // Find intersection point with clip boundary
            if (outcodeOut & TOP) { // Point is above the clip window
                x = x1 + (x2 - x1) * (y_max - y1) / (y2 - y1);
                y = y_max;
            } else if (outcodeOut & BOTTOM) { // Point is below the clip window
                x = x1 + (x2 - x1) * (y_min - y1) / (y2 - y1);
                y = y_min;
            } else if (outcodeOut & RIGHT) { // Point is to the right of clip window
                y = y1 + (y2 - y1) * (x_max - x1) / (x2 - x1);
                x = x_max;
            } else if (outcodeOut & LEFT) { // Point is to the left of clip window
                y = y1 + (y2 - y1) * (x_min - x1) / (x2 - x1);
                x = x_min;
            }

            // Replace the outside point with the intersection point
            // and update the outcode
            if (outcodeOut == outcode1) {
                x1 = x; y1 = y;
                outcode1 = computeOutCode(x1, y1, x_min, y_min, x_max, y_max);
            } else {
                x2 = x; y2 = y;
                outcode2 = computeOutCode(x2, y2, x_min, y_min, x_max, y_max);
            }
        }
    }

    // If accepted, draw the clipped line using Bresenham's line algorithm
    if (accept) {
        // You can set your color here for the clipped line
        int r =0, g = 255, b = 0;
        draw_bressenham_line(x1, y1, x2, y2, r, g, b); // Call your Bresenham function here
        clippedPoints.push_back({{x1,y1},{x2,y2}});
    }
    points.clear();
    line_endpoints.clear();
}

void MainWindow::on_rotate_about_point_clicked()
{
    if(points.size()==0)
    {
        return;
    }
    auto point=points.front();
    points.clear();
    int x=point.first,y=point.second;
    QVector<QVector<int>> temp;
    for(auto it:vertices)
    {
        temp.push_back({it.first,it.second});
    }
    on_clear_canvas_clicked();
    plotPixel(x,y,0,0,255);
    for(int i=0;i<temp.size();i++)
    {
        QVector<int> v;
        v.push_back(temp[i][0]);
        v.push_back(temp[i][1]);
        v.push_back(1);
        QVector<int> v2=translate(v,-x,-y);
        temp[i][0]=v2[0];
        temp[i][1]=v2[1];
    }
    int theta=ui->angle->value();
    for(int i=0;i<temp.size();i++)
    {
        QVector<int> v={temp[i][0],temp[i][1],1};
        QVector<int> v2=rotateBy(theta,v);
        temp[i][0]=v2[0];
        temp[i][1]=v2[1];
    }
    for(int i=0;i<temp.size();i++)
    {
        QVector<int> v;
        v.push_back(temp[i][0]);
        v.push_back(temp[i][1]);
        v.push_back(1);
        QVector<int> v2=translate(v,x,y);
        temp[i][0]=v2[0];
        temp[i][1]=v2[1];
    }
    for(auto it:temp)
    {
        vertices.push_back({it[0],it[1]});
    }
    int n=vertices.size();
    for(int i=0;i<n;i++)
    {
        draw_bressenham_line(vertices[i].first,vertices[i].second,vertices[(i+1)%n].first,vertices[(i+1)%n].second,0,255,0);
    }
}


void MainWindow::on_shear_about_point_clicked()
{
    if(points.size()==0)
    {
        return;
    }
    auto point=points.front();
    points.clear();
    int x=point.first,y=point.second;
    QVector<QVector<int>> temp;
    drawn_points.clear();
    for(int i=0;i<vertices.size();i++)
    {
        temp.push_back({vertices[i].first,vertices[i].second});
    }
    for(int i=0;i<temp.size();i++)
    {
        QVector<int> v;
        v.push_back(temp[i][0]);
        v.push_back(temp[i][1]);
        v.push_back(1);
        QVector<int> v2=translate(v,-x,-y);
        temp[i][0]=v2[0];
        temp[i][1]=v2[1];
    }
    float shear_x=ui->shear_x->value();
    float shear_y=ui->shear_y->value();
    vertices.clear();
    for(int i=0;i<temp.size();i++)
    {
        QVector<int> v={temp[i][0],temp[i][1],1};
        QVector<int> v2=shear(shear_x,shear_y,v);
        temp[i]={v2[0],v2[1]};
    }
    for(int i=0;i<temp.size();i++)
    {
        QVector<int> v;
        v.push_back(temp[i][0]);
        v.push_back(temp[i][1]);
        v.push_back(1);
        QVector<int> v2=translate(v,x,y);
        temp[i][0]=v2[0];
        temp[i][1]=v2[1];
    }
    for(auto it:temp)
    {
        vertices.push_back({it[0],it[1]});
    }
    int n=vertices.size();
    MainWindow::on_clear_canvas_clicked();
    for(int i=0;i<n;i++)
    {
        int x1=vertices[i].first;
        int x2=vertices[(i+1)%n].first;
        int y1=vertices[i].second;
        int y2=vertices[(i+1)%n].second;
        draw_bressenham_line(x1,y1,x2,y2,0,255,0);
    }
}

void MainWindow::on_scale_about_point_clicked()
{
    if(points.size()==0)return;
    int x=points.front().first,y=points.front().second;
    points.clear();
    int scale_x=ui->scale_factor_x->value();
    int scale_y=ui->scale_factor_y->value();
    QVector<pair<int,int>> temp;
    for(auto it:vertices)
    {
        temp.push_back(it);
    }
    vertices.clear();
    for(int i=0;i<temp.size();i++)
    {
        QVector<int> v;
        v.push_back(temp[i].first);
        v.push_back(temp[i].second);
        v.push_back(1);
        QVector<int> v2=translate(v,-x,-y);
        temp[i].first=v2[0];
        temp[i].second=v2[1];
    }
    for(int i=0;i<temp.size();i++)
    {
        QVector<int> v={temp[i].first,temp[i].second,1};
        QVector<int> v2=scale(scale_x,scale_y,v);
        temp[i]={v2[0],v2[1]};
    }
    for(int i=0;i<temp.size();i++)
    {
        QVector<int> v;
        v.push_back(temp[i].first);
        v.push_back(temp[i].second);
        v.push_back(1);
        QVector<int> v2=translate(v,x,y);
        temp[i].first=v2[0];
        temp[i].second=v2[1];
    }
    for(auto it:temp)
    {
        vertices.push_back(it);
    }
    int n=vertices.size();
    on_clear_canvas_clicked();
    for(int i=0;i<n;i++)
    {
        int x1=vertices[i].first;
        int x2=vertices[(i+1)%n].first;
        int y1=vertices[i].second;
        int y2=vertices[(i+1)%n].second;
        draw_bressenham_line(x1,y1,x2,y2,0,255,0);
    }
}

void MainWindow::on_reflect_about_line_clicked()
{
    int x1 = line_endpoints[0].first, y1 = line_endpoints[0].second;
    int x2 = line_endpoints[1].first, y2 = line_endpoints[1].second;
    qDebug() << "Line endpoints:" << x1 << y1 << x2 << y2;

    // Step 1: Calculate translation to bring (x1, y1) to origin
    int tx = -x1;
    int ty = -y1;

    // Step 2: Calculate rotation angle to align line with x-axis
    double angle = atan2(y2 - y1, x2 - x1);  // angle in radians

    QVector<QVector<int>> transformed_vertices;
    for (auto &vertex : vertices) {
        QVector<int> point = {vertex.first, vertex.second, 1};

        // Step 3: Translate point
        QVector<int> translated_point = translate(point, tx, ty);

        // Step 4: Rotate point to align with x-axis
        QVector<int> rotated_point = rotateBy(-angle * 180 / M_PI, translated_point);

        // Step 5: Reflect across x-axis
        QVector<int> reflected_point = x_reflect(rotated_point);

        // Step 6: Reverse the rotation
        QVector<int> rotated_back_point = rotateBy(angle * 180 / M_PI, reflected_point);

        // Step 7: Reverse the translation
        QVector<int> final_point = translate(rotated_back_point, -tx, -ty);

        // Store transformed point
        transformed_vertices.push_back({final_point[0], final_point[1]});
    }

    // Clear previous drawn points and vertices
    drawn_points.clear();
    vertices.clear();
    on_clear_canvas_clicked();

    // Draw the original line
    draw_bressenham_line(x1, y1, x2, y2, 0, 255, 0);

    // Update vertices with the reflected points
    for (const auto &point : transformed_vertices) {
        vertices.push_back({point[0], point[1]});
    }

    // Draw the reflected polygon
    int n = vertices.size();
    for (int i = 0; i < n; i++) {
        draw_bressenham_line(vertices[i].first, vertices[i].second,
                             vertices[(i + 1) % n].first, vertices[(i + 1) % n].second,
                             0, 255, 0);
    }
}

void MainWindow::on_make_window_clicked()
{
    if(points.size()<2)
    {
        return;
    }
    int x1=points[0].first,y1=points[0].second,x2=points[1].first,y2=points[1].second;
    qDebug()<<x1<<y1<<x2<<y2;
    points.clear();
    int x_left=min(x1,x2),x_right=max(x1,x2),y_bottom=min(y1,y2),y_upper=max(y1,y2);
    window_points.push_back({x_left,y_bottom});
    window_points.push_back({x_right,y_upper});
    draw_bressenham_line(x_left,y_bottom,x_right,y_bottom,0,255,0);
    draw_bressenham_line(x_right,y_bottom,x_right,y_upper,0,255,0);
    draw_bressenham_line(x_right,y_upper,x_left,y_upper,0,255,0);
    draw_bressenham_line(x_left,y_upper,x_left,y_bottom,0,255,0);
}

// Helper function to find the intersection point of a line segment with a clipping boundary
std::pair<int, int> intersect(const std::pair<int, int>& p1, const std::pair<int, int>& p2, int edge, int xmin, int ymin, int xmax, int ymax) {
    int x, y;
    if (edge == 0) {  // Left boundary
        x = xmin;
        y = p1.second + (p2.second - p1.second) * (xmin - p1.first) / (p2.first - p1.first);
    } else if (edge == 1) {  // Right boundary
        x = xmax;
        y = p1.second + (p2.second - p1.second) * (xmax - p1.first) / (p2.first - p1.first);
    } else if (edge == 2) {  // Bottom boundary
        y = ymin;
        x = p1.first + (p2.first - p1.first) * (ymin - p1.second) / (p2.second - p1.second);
    } else if (edge == 3) {  // Top boundary
        y = ymax;
        x = p1.first + (p2.first - p1.first) * (ymax - p1.second) / (p2.second - p1.second);
    }
    return {x, y};
}

// Function to check if a point is inside the clipping boundary
bool inside(const std::pair<int, int>& p, int edge, int xmin, int ymin, int xmax, int ymax) {
    switch (edge) {
    case 0: return p.first >= xmin;  // Left boundary
    case 1: return p.first <= xmax;  // Right boundary
    case 2: return p.second >= ymin;  // Bottom boundary
    case 3: return p.second <= ymax;  // Top boundary
    }
    return false;
}

// Function to perform Sutherland-Hodgeman Polygon Clipping
void MainWindow::on_sutherlandhodgemanclip_clicked() {
    if (window_points.size() < 2) return;

    int xmin = window_points[0].first;
    int ymin = window_points[0].second;
    int xmax = window_points[1].first;
    int ymax = window_points[1].second;

    QVector<pair<int,int>> final_vertices;

    for (int edge = 0; edge < 4; ++edge) {
        QVector<std::pair<int, int>> clippedPolygon;
        int n = vertices.size();

        for (int i = 0; i < n; ++i) {
            std::pair<int, int> current = vertices[i];
            std::pair<int, int> prev = vertices[(i + n - 1) % n];

            bool currInside = inside(current, edge, xmin, ymin, xmax, ymax);
            bool prevInside = inside(prev, edge, xmin, ymin, xmax, ymax);

            if (currInside) {
                if (!prevInside) {  // Entering the clipping boundary
                    clippedPolygon.append(intersect(prev, current, edge, xmin, ymin, xmax, ymax));
                }
                clippedPolygon.append(current);  // Always add the current point if it's inside
            } else if (prevInside) {  // Exiting the clipping boundary
                clippedPolygon.append(intersect(prev, current, edge, xmin, ymin, xmax, ymax));
            }
        }
        vertices = clippedPolygon;  // Update the vertices with the newly clipped polygon
    }
    final_vertices=vertices;

    on_clear_canvas_clicked();
    vertices=final_vertices;

    draw_bressenham_line(xmin,ymin,xmax,ymin,0,255,0);
    draw_bressenham_line(xmax,ymin,xmax,ymax,0,255,0);
    draw_bressenham_line(xmax,ymax,xmin,ymax,0,255,0);
    draw_bressenham_line(xmin,ymax,xmin,ymin,0,255,0);

    // Draw the clipped polygon using Bresenham's line drawing function
    for (int i = 0; i < vertices.size(); ++i) {
        int x1 = vertices[i].first;
        int y1 = vertices[i].second;
        int x2 = vertices[(i + 1) % vertices.size()].first;
        int y2 = vertices[(i + 1) % vertices.size()].second;
        draw_bressenham_line(x1, y1, x2, y2, 255, 0, 0);  // Draw line with red color
    }
}

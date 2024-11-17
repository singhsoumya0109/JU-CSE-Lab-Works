#include "mainwindow.h"
#include "ui_mainwindow.h"
#include <QPainter>
#include <QPixmap>
#include <QColor>
#include <QTimer>
#include <bits/stdc++.h>
#include <QMouseEvent>
#include <QElapsedTimer>
#define Delay delay(0)

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

void MainWindow::on_showAxis_clicked() {
    int gridOffset = (ui->gridOffset->value() == 0) ? 1  : ui->gridOffset->value();
    int width = ui->workArea->width();
    int height = ui->workArea->height();
    int centerX = width / 2;
    int centerY = height / 2;
    int axisWidth=ui->gridOffset->value();
    // qDebug()<<width<<height<<centerX<<centerY<<axisWidth;
    // Draw horizontal axis
    for (int x = 0; x < width; ++x) {
        colorPoint(x, (centerY - gridOffset/2.0), 255, 0, 0, axisWidth); // Black color
    }

    // Draw vertical axis
    for (int y = 0; y < height; ++y) {
        colorPoint(centerX + gridOffset/2.0, y, 255, 0, 0, axisWidth); // Black color
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
    if(watched == ui->workArea && event->type() == QEvent::MouseButtonPress)
    {
        QMouseEvent *cursor = static_cast<QMouseEvent*>(event);
        int x = cursor->pos().x();
        int y = cursor->pos().y();
        int gridOffset = (ui->gridOffset->value()==0)?1:ui->gridOffset->value();
        int width = ui->workArea->width();
        int height = ui->workArea->height();
        int centerX=width/2;
        int centerY=height/2;
        clickedPoint.setX(x);
        clickedPoint.setY(y);
        // points.push_back({})
        int X = floor((x-centerX)*1.0/gridOffset);
        int Y = floor((centerY-y)*1.0/gridOffset);
        points.push_back({X, Y});
        int calcX = centerX+ X*gridOffset + gridOffset/2;
        int calcY = centerY -  Y*gridOffset - gridOffset/2;
        //points.push_back({calcX, calcY});
        colorPoint(calcX, calcY, 0,0, 255, gridOffset);

    }
    return QMainWindow::eventFilter(watched, event);

}

void MainWindow::draw_dda_line(float x1, float y1, float x2, float y2)
{
    float dx, dy, xinc, yinc, steps;
    int x, y;

    dx = x2 - x1;
    dy = y2 - y1;
    steps = std::max(abs(dx), abs(dy));  // Determine the number of steps based on the larger difference

    xinc = dx / steps;  // Increment in x
    yinc = dy / steps;  // Increment in y

    int gridOffset = (ui->gridOffset->value() == 0) ? 1 : ui->gridOffset->value();
    int width = ui->workArea->width();
    int height = ui->workArea->height();
    int centerX = width / 2;
    int centerY = height / 2;

    float x_float = centerX + x1 * gridOffset + gridOffset / 2.0;
    float y_float = centerY - y1 * gridOffset - gridOffset / 2.0;

    int xn = static_cast<int>(x_float);  // Initial x position in the grid
    int yn = static_cast<int>(y_float);  // Initial y position in the grid

    qDebug() << xn << yn;  // Print the x, y values for debugging
    colorPoint(xn, yn, 0, 255, 0, gridOffset);  // Color the initial point

    for (int i = 1; i <= steps; i++)  // Loop to complete the straight line
    {
        x_float += xinc * gridOffset;
        y_float -= yinc * gridOffset;

        int x_new = static_cast<int>(x_float);  // New x position in the grid
        int y_new = static_cast<int>(y_float);  // New y position in the grid

        if (x_new != xn || y_new != yn)  // If there is a change in the grid position
        {
            xn = x_new;
            yn = y_new;
            int X = floor((xn-centerX)*1.0/gridOffset);
            int Y = floor((centerY-yn)*1.0/gridOffset);
            int calcX = centerX+ X*gridOffset + gridOffset/2;
            int calcY = centerY -  Y*gridOffset - gridOffset/2;
            colorPoint(calcX, calcY, 0, 255, 0, gridOffset);  // Color the new point
        }

        qDebug() << x_new << y_new;  // Print the updated x, y values for debugging
    }
}


void MainWindow::draw_bresenham_line(int x1, int y1, int x2, int y2)
{

    int dx = abs(x2 - x1);
    int dy = abs(y2 - y1);
    int x, y, xEnd, yEnd;

    int xsign = (x2 > x1) ? 1 : -1;
    int ysign = (y2 > y1) ? 1 : -1;

    bool isSteep = dy > dx;  // Check if the slope is steep

    if (isSteep)
    {
        std::swap(x1, y1);
        std::swap(x2, y2);
        std::swap(dx, dy);
    }

    int p = 2 * dy - dx;
    int twoDy = 2 * dy;
    int twoDyDx = 2 * (dy - dx);

    int gridOffset = (ui->gridOffset->value() == 0) ? 1 : ui->gridOffset->value();
    int width = ui->workArea->width();
    int height = ui->workArea->height();
    int centerX = width / 2;
    int centerY = height / 2;

    x = x1;
    y = y1;
    xEnd = x2;
    yEnd = y2;

    // Convert to grid coordinates
    int xGrid = centerX + (isSteep ? y : x) * gridOffset + gridOffset / 2;
    int yGrid = centerY - (isSteep ? x : y) * gridOffset - gridOffset / 2;

    colorPoint(xGrid, yGrid, 0, 255, 0, gridOffset);  // Color the initial point

    for (int i = 0; i < dx; ++i)
    {
        x += xsign;
        if (p < 0)
        {
            p += twoDy;
        }
        else
        {
            y += ysign;
            p += twoDyDx;
        }

        xGrid = centerX + (isSteep ? y : x) * gridOffset + gridOffset / 2;
        yGrid = centerY - (isSteep ? x : y) * gridOffset - gridOffset / 2;

        colorPoint(xGrid, yGrid, 0, 255, 255, gridOffset);  // Color the current point
    }


}

void MainWindow::on_setCoord_clicked()
{

}


void MainWindow::on_DDADraw_clicked()
{
    QElapsedTimer timer;
    timer.start();
    if(points.size()< 2 ) return;
    qint64 n  = points.size();
    auto coords1 = points[n-1];
    auto coords2 = points[n-2];
    draw_dda_line(coords1.x(), coords1.y(), coords2.x(), coords2.y());
    qint64 elapsedTime = timer.elapsed();
    ui->DDA_TIME->setText(QString::number(elapsedTime));
}




// Store the current state of the canvas
void MainWindow::on_store_clicked()
{
    // Store the current pixmap (canvas) in a QPixmap object called `temp`
    temp = ui->workArea->pixmap(Qt::ReturnByValue);
}

// Reset the canvas to the stored state
void MainWindow::on_reset_clicked()
{
    // Set the canvas back to the stored pixmap (temp)
    ui->workArea->setPixmap(temp);

    // Clear the points vector as well, since we are resetting the canvas
}


void MainWindow::on_pushButton_clicked()
{
    QElapsedTimer timer;
    timer.start();
    if(points.size()< 2 ) return;
    int n = points.size();
    auto coords1 = points[n-1];
    auto coords2 = points[n-2];
    draw_bresenham_line(coords1.x(), coords1.y(), coords2.x(), coords2.y());
    qint64 elapsedTime = timer.elapsed();
    ui->Bresenham_TIME->setText(QString::number(elapsedTime));
}







// void MainWindow::on_Polar_draw_clicked()
// {
//     if (points.isEmpty()) {
//         return; // No points available to draw the circle
//     }

//     // Get the radius from the spin box
//     int r = ui->spinBox->value(); // Assuming you have a spin box named radiusSpinBox

//     // Get the last point from the points vector as the center of the circle
//     QPoint center = points.last();
//     int gridOffset = (ui->gridOffset->value() == 0) ? 1 : ui->gridOffset->value();
//     int width = ui->workArea->width();
//     int height = ui->workArea->height();
//     int centerX = width / 2;
//     int centerY = height / 2;
//     float angle=0.0;
//     float step=M_PI/(2*r);
//     float sin=0.0;
//     float cos=1.0;
//     float sin1=step-(step*step*step)/6.0;
//     float cos1=1-(step*step/2);
//     int xc = center.x();
//     int yc = center.y();
//     while(angle<=M_PI/4)
//     {
//         int x=(int)(xc+r*cos*gridOffset);
//         int y=(int)(yc-r*sin*gridOffset);
//         int x1=floor((x-centerX)*1.0/gridOffset);
//         int y1=floor((centerY-y)*1.0/gridOffset);
//         int calc_x=centerX+x1*gridOffset+gridOffset/2;
//         int calc_y=centerY-y1*gridOffset-gridOffset/2.0;

//         colorPoint(calc_x,calc_y,0,0,255,gridOffset);
//         colorPoint(calc_x,2*yc-calc_y,0,0,255,gridOffset);
//         colorPoint(2*xc-calc_x,calc_y,0,0,255,gridOffset);
//         colorPoint(2*xc-calc_x,2*yc-calc_y,0,0,255,gridOffset);
//         int x_new=xc+yc-y;
//         int y_new=yc-xc+x;
//         x1=floor((x_new-centerX)*1.0/gridOffset);
//         y1=floor((centerY-y_new)*1.0/gridOffset);
//         calc_x=centerX+x1*gridOffset+gridOffset/2;
//         calc_x=centerX+x1*gridOffset+gridOffset/2;

//         colorPoint(calc_x,calc_y,0,0,255,gridOffset);
//         colorPoint(calc_x,2*yc-calc_y,0,0,255,gridOffset);
//         colorPoint(2*xc-calc_x,calc_y,0,0,255,gridOffset);
//         colorPoint(2*xc-calc_x,2*yc-calc_y,0,0,255,gridOffset);


//         angle+=step;
//         float cos2=cos*cos1-sin*sin1;
//         float sin2=sin*cos1+cos*sin1;
//         sin=sin2;
//         cos=cos2;


//     }



// }


void MainWindow::on_Polar_draw_clicked()
{
    if (points.isEmpty()) {
        return; // No points available to draw the circle
    }

    // Get the radius from the spin box
    int r = ui->spinBox->value();

    // Get the last point from the points vector as the center of the circle
    QPoint center = points.last();
    int xc = center.x();
    int yc = center.y();
    // Assuming gridOffset is the spacing between grid points
    int gridOffset = (ui->gridOffset->value() == 0) ? 1 : ui->gridOffset->value();

    // Get the work area dimensions
    int width = ui->workArea->width();
    int height = ui->workArea->height();

    // Calculate the center of the grid
    int centerX = center.x();
    int centerY = center.y();

    float angle = 0.0;
    float step = M_PI / (2 * r);
    float sin = 0.0;
    float cos = 1.0;
    float sin1 = step - (step * step * step) / 6.0;
    float cos1 = 1 - (step * step / 2);

    auto colorSymmetricPoints = [&](int x, int y) {
        // Color all the symmetric points
        colorPoint(x, y, 0, 0, 255, gridOffset);
        colorPoint(x, 2 * centerY - y, 0, 0, 255, gridOffset);
        colorPoint(2 * centerX - x, y, 0, 0, 255, gridOffset);
        colorPoint(2 * centerX - x, 2 * centerY - y, 0, 0, 255, gridOffset);
    };

    while (angle <= M_PI / 4)
    {
        // Calculate the new points in pixel space based on the center and radius
        int x = static_cast<int>(centerX + r * cos);
        int y = static_cast<int>(centerY - r * sin);

        // Map logical grid points to actual pixel coordinates
        int calc_x =centerX + x * gridOffset + gridOffset / 2;
        int calc_y = centerY - y * gridOffset - gridOffset / 2;

        colorSymmetricPoints(calc_x, calc_y);

        // Calculate the next point using the reflected points
        int x_new = centerX + yc - y;
        int y_new = centerY - xc + x;

        calc_x = x_new * gridOffset + gridOffset / 2;
        calc_y = y_new * gridOffset + gridOffset / 2;

        colorSymmetricPoints(calc_x, calc_y);

        // Increment the angle and update sin and cos values
        angle += step;
        float cos2 = cos * cos1 - sin * sin1;
        float sin2 = sin * cos1 + cos * sin1;
        sin = sin2;
        cos = cos2;
    }
}




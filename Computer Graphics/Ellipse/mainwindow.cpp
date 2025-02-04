#include "mainwindow.h"
#include "ui_mainwindow.h"
#include <QPainter>
#include <QPixmap>
#include <QColor>
#include <QTimer>
#include <QMouseEvent>
#include <QElapsedTimer>
#include <QTime>
#define Delay delay(300)

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
    int width = ui->workArea->width();
    int height = ui->workArea->height();
    int centerX = width / 2;
    int centerY = height / 2;
    int axisWidth=ui->axisWidth->value();
    int gridOffset = (ui->gridOffset->value()==0)?1:ui->gridOffset->value();

    qDebug()<<width<<height<<centerX<<centerY<<axisWidth;
    // Draw horizontal axis
    for (int x = 0; x < width; ++x) {
        colorPoint(x,(centerY-gridOffset/2.0), 255, 0, 0,gridOffset ); // Black color
    }

    // Draw vertical axis
    for (int y = 0; y < height; ++y) {
        colorPoint((centerX+gridOffset/2.0), y, 255, 0, 0, gridOffset); // Black color
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
        qDebug()<<x<<y;
        int gridOffset = (ui->gridOffset->value()==0)?1:ui->gridOffset->value();
        int width = ui->workArea->width();
        int height = ui->workArea->height();
        int centerX=width/2;
        int centerY=height/2;
        clickedPoint.setX(x);
        clickedPoint.setY(y);
        int X = floor((x-centerX)*1.0/gridOffset);
        int Y = floor((centerY-y)*1.0/gridOffset);
        int calcX = centerX+ X*gridOffset + gridOffset/2.0;
        int calcY = centerY- Y*gridOffset - gridOffset/2.0;
        points.append(QPoint(calcX,calcY));
        colorPoint(calcX,calcY,0,0,255,gridOffset);
    }
    return QMainWindow::eventFilter(watched, event);
}


void MainWindow::on_pushButton_3_clicked()
{
    temp = ui->workArea->pixmap(Qt::ReturnByValue);
}

void MainWindow::on_pushButton_4_clicked()
{
    ui->workArea->setPixmap(temp);
}

void MainWindow::draw_polar_circle(int xc,int yc,int r)
{
    int gridOffset = (ui->gridOffset->value()==0)?1:ui->gridOffset->value();
    int width = ui->workArea->width();
    int height = ui->workArea->height();
    int centerX=width/2;
    int centerY=height/2;

    float angle = 0.0;
    float angle_step = M_PI/(2*r);

    //inital values of sin cos
    float sin_theta = 0.0;
    float cos_theta = 1.0;

    //delta = delta_theta,these are incremental values of sin cos
    float sin_delta = angle_step - (angle_step*angle_step*angle_step)/6.0;
    float cos_delta = 1-(angle_step*angle_step)/2.0;

    qDebug()<<xc<<yc;
    while(angle<=M_PI/4)
    {
        int x = static_cast<int>(xc+r*cos_theta*gridOffset);
        int y = static_cast<int>(yc-r*sin_theta*gridOffset);

        int X = floor((x-centerX)*1.0/gridOffset);
        int Y = floor((centerY-y)*1.0/gridOffset);
        int calc_x = centerX+ X*gridOffset + gridOffset/2.0;
        int calc_y= centerY- Y*gridOffset - gridOffset/2.0;

        //octant 1,4,5,8
        colorPoint(calc_x,calc_y,0,0,255,gridOffset);
        colorPoint(calc_x,2*yc-calc_y,0,0,255,gridOffset);
        colorPoint(2*xc-calc_x,calc_y,0,0,255,gridOffset);
        colorPoint(2*xc-calc_x,2*yc-calc_y,0,0,255,gridOffset);

        int x_new = xc+yc-y;
        int y_new = yc-xc+x;

        X = floor((x_new-centerX)*1.0/gridOffset);
        Y = floor((centerY-y_new)*1.0/gridOffset);
        calc_x = centerX+ X*gridOffset + gridOffset/2.0;
        calc_y= centerY- Y*gridOffset - gridOffset/2.0;

        //octant 2,3,6,7
        colorPoint(calc_x,calc_y,0,0,255,gridOffset);
        colorPoint(calc_x,2*yc-calc_y,0,0,255,gridOffset);
        colorPoint(2*xc-calc_x,calc_y,0,0,255,gridOffset);
        colorPoint(2*xc-calc_x,2*yc-calc_y,0,0,255,gridOffset);
        //qDebug()<<x<<y<<2*xc-x<<2*yc-y;

        angle+=angle_step;
        float cos_theta_new = cos_theta*cos_delta-sin_theta*sin_delta;
        float sin_theta_new = sin_theta*cos_delta+cos_theta*sin_delta;
        cos_theta=cos_theta_new;
        sin_theta=sin_theta_new;
    }
}

void MainWindow::on_polar_clicked()
{
    QPoint p = points[points.size()-1];
    int r = ui->textEdit->toPlainText().toInt();
    QTime start = QTime::currentTime();
    draw_polar_circle(p.x(),p.y(),r);
    QTime finish = QTime::currentTime();
    int t1=start.second()*1000+start.msec();
    int t2=finish.second()*1000 +finish.msec();
    ui->lcdNumber->display(t2-t1);
}

void MainWindow::draw_bresenham_circle(int xc,int yc,int r)
{
    int gridOffset = (ui->gridOffset->value()==0)?1:ui->gridOffset->value();
    int width = ui->workArea->width();
    int height = ui->workArea->height();
    int centerX=width/2;
    int centerY=height/2;

    int x = xc;
    int y = yc-r*gridOffset;
    //print first point
    colorPoint(x,y,0,255,0,gridOffset);
    colorPoint(x,2*yc-y,0,255,0,gridOffset);
    colorPoint(2*xc-x,y,0,255,0,gridOffset);
    colorPoint(2*xc-x,2*yc-y,0,255,0,gridOffset);
    int x_new = xc+yc-y;
    int y_new = xc+yc-x;
    colorPoint(x_new,y_new,0,255,0,gridOffset);
    colorPoint(x_new,2*yc-y_new,0,255,0,gridOffset);
    colorPoint(2*xc-x_new,y_new,0,255,0,gridOffset);
    colorPoint(2*xc-x_new,2*yc-y_new,0,255,0,gridOffset);

    int p = (1-r)*gridOffset;
    x=x+gridOffset;
    while((x-xc)<=(yc-y))
    {
        if(p<0)
        {
            qDebug()<<1;
            p = p+2*(x-xc)+3*gridOffset;
        }
        else
        {
            qDebug()<<0;
            y=y+gridOffset;
            p = p+2*((x-xc)-(yc-y))+5*gridOffset;
        }
        //printPoints
        colorPoint(x,y,0,255,0,gridOffset);
        colorPoint(x,2*yc-y,0,255,0,gridOffset);
        colorPoint(2*xc-x,y,0,255,0,gridOffset);
        colorPoint(2*xc-x,2*yc-y,0,255,0,gridOffset);

        x_new = xc+yc-y;
        y_new = xc+yc-x;
        colorPoint(x_new,y_new,0,255,0,gridOffset);
        colorPoint(x_new,2*yc-y_new,0,255,0,gridOffset);
        colorPoint(2*xc-x_new,y_new,0,255,0,gridOffset);
        colorPoint(2*xc-x_new,2*yc-y_new,0,255,0,gridOffset);

        x=x+gridOffset;
    }


}

void MainWindow::on_bresenham_clicked()
{
    QPoint p = points[points.size()-1];
    int r = ui->textEdit->toPlainText().toInt();
    QTime start = QTime::currentTime();
    draw_bresenham_circle(p.x(),p.y(),r);
    QTime finish = QTime::currentTime();
    int t1=start.msec();
    int t2=finish.msec();
    ui->lcdNumber_2->display(t2-t1);
}

void MainWindow::draw_polar_ellipse(int xc,int yc,int a,int b)
{

    int re =ui->red->value();
    int g =ui->green->value();
    int bl =ui->blue->value();
    int gridOffset = (ui->gridOffset->value()==0)?1:ui->gridOffset->value();
    int width = ui->workArea->width();
    int height = ui->workArea->height();
    int centerX=width/2;
    int centerY=height/2;

    int r = a;
    if(a<b)
        r = b;
    qDebug()<<r<<a<<b;

    float angle = 0.0;
    float angle_step = M_PI/(4*r);

    //inital values of sin cos
    float sin_theta = 0.0;
    float cos_theta = 1.0;

    //delta = delta_theta,these are incremental values of sin cos
    float sin_delta = angle_step - (angle_step*angle_step*angle_step)/6.0;
    float cos_delta = 1-(angle_step*angle_step)/2.0;

    qDebug()<<xc<<yc;
    float pi_2 = 1.5708;
    while(angle<=pi_2)
    {
        int x = static_cast<int>(xc+a*cos_theta*gridOffset);
        int y = static_cast<int>(yc-b*sin_theta*gridOffset);

        int X = floor((x-centerX)*1.0/gridOffset);
        int Y = floor((centerY-y)*1.0/gridOffset);
        int calc_x = centerX+ X*gridOffset + gridOffset/2.0;
        int calc_y= centerY- Y*gridOffset - gridOffset/2.0;

        colorPoint(calc_x,calc_y,re,g,bl,gridOffset);
        colorPoint(calc_x,2*yc-calc_y,re,g,bl,gridOffset);
        colorPoint(2*xc-calc_x,calc_y,re,g,bl,gridOffset);
        colorPoint(2*xc-calc_x,2*yc-calc_y,re,g,bl,gridOffset);
        qDebug()<<angle<<angle_step<<M_PI<<M_PI/2;
        angle+=angle_step;
        float cos_theta_new = cos_theta*cos_delta-sin_theta*sin_delta;
        float sin_theta_new = sin_theta*cos_delta+cos_theta*sin_delta;
        cos_theta=cos_theta_new;
        sin_theta=sin_theta_new;
        qDebug()<<angle<<angle_step<<M_PI<<M_PI/2;
        Delay;
    }
    qDebug()<<angle<<angle_step<<M_PI<<M_PI/2;

}

void MainWindow::on_polar_ellipse_clicked()
{
    QPoint p = points[points.size()-1];
    int a = ui->textEdit_2->toPlainText().toInt();
    int b = ui->textEdit_3->toPlainText().toInt();
    QTime start = QTime::currentTime();
    draw_polar_ellipse(p.x(),p.y(),a,b);
    QTime finish = QTime::currentTime();
    int t1=start.second()*1000+start.msec();
    int t2=finish.second()*1000 +finish.msec();
    ui->lcdNumber_3->display(t2-t1);
}

void MainWindow::draw_bresenham_ellipse(int xc,int yc,int a,int b)
{
    int r =ui->red->value();
    int g =ui->green->value();
    int bl =ui->blue->value();
    int gridOffset = (ui->gridOffset->value()==0)?1:ui->gridOffset->value();
    /*int width = ui->workArea->width();
    int height = ui->workArea->height();
    int centerX=width/2;
    int centerY=height/2;*/

    float d1, d2;
    int x,y;
    int flag = 0;
    x = xc;
    y = yc-b*gridOffset;

    colorPoint(x,y,r,g,bl,gridOffset);
    colorPoint(x,2*yc-y,r,g,bl,gridOffset);
    colorPoint(2*xc-x,y,r,g,bl,gridOffset);
    colorPoint(2*xc-x,2*yc-y,r,g,bl,gridOffset);
    x = x+gridOffset;

    // Initial decision parameter of region 1
    d1 = (b*b) - (a*a*b) + (0.25*a*a);

    while ((b*b*(x-xc)/gridOffset)<(a*a*(yc-y)/gridOffset))
    {
        if (d1 < 0)
        {
            d1 = d1 + b*b*(1+2*(x-xc)/gridOffset);
        }
        else
        {
            y = y+gridOffset;
            d1 = d1 + b*b*(1+2*(x-xc)/gridOffset) + a*a*(2-2*(yc-y)/gridOffset);
        }
        /*if(((yc-y)<=gridOffset) && ((x-xc)<a))
        {
            flag=1;
            int yt = yc-gridOffset;
            colorPoint(x,yt,0,153,153,gridOffset);
            colorPoint(x,2*yc-yt,0,153,153,gridOffset);
            colorPoint(2*xc-x,yt,0,153,153,gridOffset);
            colorPoint(2*xc-x,2*yc-yt,0,153,153,gridOffset);
            x = x+gridOffset;
        }
        if(flag==0)
        {
            colorPoint(x,y,0,153,153,gridOffset);
            colorPoint(x,2*yc-y,0,153,153,gridOffset);
            colorPoint(2*xc-x,y,0,153,153,gridOffset);
            colorPoint(2*xc-x,2*yc-y,0,153,153,gridOffset);
            x = x+gridOffset;
        }*/

        colorPoint(x,y,r,g,bl,gridOffset);
        colorPoint(x,2*yc-y,r,g,bl,gridOffset);
        colorPoint(2*xc-x,y,r,g,bl,gridOffset);
        colorPoint(2*xc-x,2*yc-y,r,g,bl,gridOffset);
        x = x+gridOffset;
    }
    qDebug()<<100<<x<<y;
    colorPoint(x,y,r,g,bl,gridOffset);
    colorPoint(x,2*yc-y,r,g,bl,gridOffset);
    colorPoint(2*xc-x,y,r,g,bl,gridOffset);
    colorPoint(2*xc-x,2*yc-y,r,g,bl,gridOffset);
    y = y+gridOffset;

    // Decision parameter of region 2
    float t1 = b*((x-xc)/gridOffset+0.5);
    float t2 = a*(yc-y)/gridOffset;
    d2 = qPow(t1,2)+qPow(t2,2)-(a*a*b*b);
    qDebug()<<x<<y;

    while ((yc-y)>=0)
    {
        if (d2 <= 0)
        {
            qDebug()<<0;
            d2 = d2 + a*a*(1-2*(yc-y)/gridOffset);
        }
        else
        {
            qDebug()<<1;
            x = x+gridOffset;
            d2 = d2 + a*a*(1-2*(yc-y)/gridOffset) + b*b*(2+2*(x-xc));
        }
        if(((x-xc)/gridOffset)>a)
        {
            qDebug()<<11;
            x=xc+a*gridOffset;
        }

        colorPoint(x,y,r,g,bl,gridOffset);
        colorPoint(x,2*yc-y,r,g,bl,gridOffset);
        colorPoint(2*xc-x,y,r,g,bl,gridOffset);
        colorPoint(2*xc-x,2*yc-y,r,g,bl,gridOffset);
        y = y+gridOffset;
        qDebug()<<x<<y;
    }
    //if((yc-y)<0 && ((x-xc)<=a)

}
void MainWindow::on_bresenham_ellipse_clicked()
{
    QPoint p = points[points.size()-1];
    int a = ui->textEdit_2->toPlainText().toInt();
    int b = ui->textEdit_3->toPlainText().toInt();
    QTime start = QTime::currentTime();
    draw_bresenham_ellipse(p.x(),p.y(),a,b);
    QTime finish = QTime::currentTime();
    int t1=start.second()*1000+start.msec();
    int t2=finish.second()*1000 +finish.msec();
    ui->lcdNumber_4->display(t2-t1);
}


void MainWindow::fillColor()
{
    int r =ui->red->value();
    int g =ui->green->value();
    int bl =ui->blue->value();

}

void MainWindow::on_pushButton_clicked()
{

    QPoint p = points[points.size()-1];
    fillColor(p.x(),p.y());
}


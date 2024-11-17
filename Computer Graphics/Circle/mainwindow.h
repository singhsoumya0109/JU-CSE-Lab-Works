#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>

QT_BEGIN_NAMESPACE
namespace Ui {
class MainWindow;
}
QT_END_NAMESPACE

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    MainWindow(QWidget *parent = nullptr);
    ~MainWindow();
protected:
    bool eventFilter(QObject *watched, QEvent *event) override;
private slots:
    void on_showAxis_clicked();

    void on_gridlines_clicked();

    void on_pushButton_3_clicked();

    void on_pushButton_4_clicked();


    void on_polar_clicked();

    void on_bresenham_clicked();

private:
    Ui::MainWindow *ui;
    void colorPoint(int x,int y,int r,int g, int b, int penwidth);
    void delay(int ms);
    QPixmap temp;
    QPoint clickedPoint;
    QVector<QPoint> points;
    void draw_polar_circle(int xc,int yc,int r);
    void draw_bresenham_circle(int xc,int yc,int r);
};
#endif // MAINWINDOW_H

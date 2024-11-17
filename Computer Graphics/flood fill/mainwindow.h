// #ifndef MAINWINDOW_H
// #define MAINWINDOW_H
// #include<bits/stdc++.h>
// #include<QVector>
// #include <QMainWindow>
// using namespace std;
// QT_BEGIN_NAMESPACE
// namespace Ui {
// class MainWindow;
// }
// QT_END_NAMESPACE

// class MainWindow : public QMainWindow
// {
//     Q_OBJECT

// public:
//     MainWindow(QWidget *parent = nullptr);
//     ~MainWindow();
// protected:
//     bool eventFilter(QObject *watched, QEvent *event) override;
// private slots:
//     void on_showAxis_clicked();

//     void on_gridlines_clicked();

//     void on_dda_line_clicked();

//     void on_draw_bressenheim_line_clicked();

//     void on_draw_polar_circle_clicked();

//     void on_draw_bressenham_circle_clicked();

//     void on_draw_polar_ellipse_clicked();

//     void on_draw_bressenham_ellipse_clicked();

//     void on_redraw_shape_clicked();

//     void on_flood_fill_clicked();

//     void on_draw_polygon_clicked();

//     void on_boundary_fill_clicked();

//     void on_fill_by_scanline_clicked();

//     void on_clear_canvas_clicked();

// private:
//     Ui::MainWindow *ui;
//     void colorPoint(int x,int y,int r,int g, int b, int penwidth);
//     void delay(int ms);
//     void markBox(int x,int y,int r,int g,int b);
//     void draw_dda_line(int x1,int y1,int x2,int y2);
//     void draw_bressenham_line(int x1,int x2,int y1,int y2);
//     void draw_polar_circle(int centerx,int centery,int radius);
//     void draw_bressenham_circle(int x_center,int y_center,int radius);
//     void plotPixel(int x,int y,int r,int g,int b);
//     void draw_polar_ellipse(int x_center,int y_center,int a,int b);
//     void draw_bressenham_ellipse(int x_center,int y_center,int a,int b);
//     void flood_fill(int x,int y,int r,int g,int b,set<pair<int,int>> &st,int max_x,int min_x,int max_y,int min_y);
//     void boundary_fill(int x,int y,int r,int g,int b,set<pair<int,int>> &st,int max_x,int min_x,int max_y,int min_y);
//     bool is_inside(int x,int y);
//     QPoint clickedPoint;
//     QSet<QVector<int>> drawn_points;
//     QVector<pair<int,int>> polygon_points;
//     QVector<pair<int,int>> vertices;
// };
// #endif // MAINWINDOW_H


#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <bits/stdc++.h>
#include <QVector>
#include <QMainWindow>
#include <QSet>
using namespace std;

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
    void on_dda_line_clicked();
    void on_draw_bressenheim_line_clicked();
    void on_draw_polar_circle_clicked();
    void on_draw_bressenham_circle_clicked();
    void on_draw_polar_ellipse_clicked();
    void on_draw_bressenham_ellipse_clicked();
    void on_redraw_shape_clicked();
    void on_flood_fill_clicked();
    void on_draw_polygon_clicked();
    void on_boundary_fill_clicked();
    void on_fill_by_scanline_clicked();
    void on_clear_canvas_clicked();

private:
    Ui::MainWindow *ui;

    // Helper functions for drawing
    void colorPoint(int x, int y, int r, int g, int b, int penwidth);
    void delay(int ms);
    void markBox(int x, int y, int r, int g, int b);
    void draw_dda_line(int x1, int y1, int x2, int y2);
    void draw_bressenham_line(int x1, int x2, int y1, int y2);
    void draw_polar_circle(int centerx, int centery, int radius);
    void draw_bressenham_circle(int x_center, int y_center, int radius);
    void plotPixel(int x, int y, int r, int g, int b);
    void draw_polar_ellipse(int x_center, int y_center, int a, int b);
    void draw_bressenham_ellipse(int x_center, int y_center, int a, int b);
    void flood_fill(int x, int y, int r, int g, int b, set<pair<int,int>> &st, int max_x, int min_x, int max_y, int min_y);
    void boundary_fill(int x, int y, int r, int g, int b, set<pair<int,int>> &st, int max_x, int min_x, int max_y, int min_y);
    bool is_inside(int x, int y);

    // Scanline algorithm functions
    void initEdgeTable();   // Initialize the Edge Table
    void storeEdgeInTable(int x1, int y1, int x2, int y2); // Store edges in Edge Table
    void storeEdgeInTuple(struct edgetabletup *receiver, int ymax, int xofymin, float slopeinverse);
    void removeEdgeByYmax(struct edgetabletup *Tup, int y); // Remove edges from Active Edge Tuple by ymax
    void updatexbyslopeinv(struct edgetabletup *Tup); // Update x for active edges by slope inverse
    void insertionSort(struct edgetabletup *ett); // Sort active edge tuple

    QPoint clickedPoint;
    QSet<QVector<int>> drawn_points;
    QVector<pair<int,int>> polygon_points;
    QVector<pair<int,int>> vertices;

    // Structs and constants for the scanline algorithm
    struct edgebucket {
        int ymax;           // Maximum y-coordinate of the edge
        float xofymin;      // x-coordinate of the lower vertex
        float slopeinverse; // Inverse slope of the edge
    };

    struct edgetabletup {
        int countEdgeBucket;  // Number of edges in this scanline
        struct edgebucket buckets[1000];  // Array of edge buckets for this scanline
    };

    static const int maxHt = 1000;  // Max height for the canvas
    static const int maxVer = 1000; // Max number of vertices
    struct edgetabletup EdgeTable[maxHt], ActiveEdgeTuple;  // Edge Table and Active Edge Tuple
};

#endif // MAINWINDOW_H

import java.util.Scanner;

public class main {
    public static void main(String[] args) {
        init();
//        triangle triangle1 = new triangle();
//        triangle1.init();
    }

    public static void init(){
        Scanner scanner = new Scanner(System.in);
//        System.out.println("Please enter the edge length of the triangle:");
        int a = 0,b = 0,c = 0,flag = 0;
        boolean checkA = scanner.hasNextInt();
        if(!checkA){
            System.out.print("Please enter a positive integer!");
            flag++;
        }else{
            a = scanner.nextInt();
            if(a<=0){
                System.out.print("Please enter a positive integer!");
                flag++;
            }else if (a > 200){
                System.out.print("The edge length cannot be greater than 200!");
                flag++;
            }
        }
        if(flag==0){
            boolean checkB = scanner.hasNextInt();
            if(!checkB){
                System.out.print("Please enter a positive integer!");
                flag++;
            }else{
                b = scanner.nextInt();
                if(b<=0){
                    System.out.print("Please enter a positive integer!");
                    flag++;
                }else if (b > 200){
                    System.out.print("The edge length cannot be greater than 200!");
                    flag++;
                }
            }
        }
        if(flag==0){
            boolean checkC = scanner.hasNextInt();
            if(!checkC){
                System.out.print("Please enter a positive integer!");
                flag++;
            }else {
                c = scanner.nextInt();
                if(c<=0){
                    System.out.print("Please enter a positive integer!");
                    flag++;
                }else if (c > 200){
                    System.out.print("The edge length cannot be greater than 200!");
                    flag++;
                }
            }
        }
        if(flag==0) {
            getTriangeShape(a,b,c);
        }

    }

    public static void getTriangeShape(int a, int b, int c){
        if((a+b<=c)||(a+c<=b)||(b+c<=a)){
            System.out.print("This is not a triangle!");
        }else if(a==b && b==c){
            System.out.print("This is an equilateral triangle!");
        }else if(a==b||b==c||a==c){
            System.out.print("This is an iso-waist triangle!");
        }else if(a*a==b*b+c*c || b*b==a*a+c*c || c*c==a*a+b*b){
            System.out.print("This is a right triangle!");
        }else if((a*a+b*b<c*c)||(a*a+c*c<b*b)||(b*b+c*c<a*a)){
            System.out.print("This is a blunt triangle!");
        }else{
            System.out.print("This is a sharp triangle!");
        }
    }
}

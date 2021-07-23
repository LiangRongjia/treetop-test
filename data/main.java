import java.util.Scanner;

/**
 * @Author LHGRylynn
 * @Date 2021/5/10 8:17
 * @Description 3 - Sale System.
 */
public class main {
    public static void main(String[] args) {

        Scanner scan = new Scanner(System.in);
        String input = scan.nextLine();

        if (condition(input)) {
            calculatedReward(input);
        }
    }

    public static boolean condition(String input) {
        int zj_max = 70;
        int xsq_max = 80;
        int ws_max = 90;

        int min_num = 1;

        int zj_num = 0;
        int xsq_num = 0;
        int ws_num = 0;

        int ifEnd = 0;

        String[] split_nextLine = input.split("\\s+");

        for (String s : split_nextLine) {
            int num1 = Integer.parseInt(s.split(",")[0]);
            int num2 = Integer.parseInt(s.split(",")[1]);
            int num3 = Integer.parseInt(s.split(",")[2]);

            if (num1 == -1) ifEnd = 1;

            if (num1 < -1 || num2 < 0 || num3 < 0) {
                System.out.print("sales volume<0");
                return false;
            }
        }

        if (ifEnd == 0) {
            System.out.print("no end with -1");
            return false;
        }

        for (String s : split_nextLine) {
            if (!s.split(",")[0].equals("-1")) {
                zj_num += Integer.parseInt(s.split(",")[0]);
                xsq_num += Integer.parseInt(s.split(",")[1]);
                ws_num += Integer.parseInt(s.split(",")[2]);
            } else break;
        }

        if (zj_num < min_num || xsq_num < min_num || ws_num < min_num) {
            System.out.print("at lease 1 complete computer");
            return false;
        }
        if (zj_num > zj_max) {
            System.out.print("sales volume of host over-limited");
            return false;
        }
        if (xsq_num > xsq_max) {
            System.out.print("sales volume of display over-limited");
            return false;
        }
        if (ws_num > ws_max) {
            System.out.print("sales volume of peripheral over-limited");
            return false;
        }
        return true;
    }

    public static void calculatedReward(String input) {
        int zj_num = 0;
        int xsq_num = 0;
        int ws_num = 0;

        int zj_price = 25;
        int xsq_price = 30;
        int ws_price = 45;

        String[] split_nextLine = input.split("\\s+");

        for (String s : split_nextLine) {
            if (!s.split(",")[0].equals("-1")) {
                zj_num += Integer.parseInt(s.split(",")[0]);
                xsq_num += Integer.parseInt(s.split(",")[1]);
                ws_num += Integer.parseInt(s.split(",")[2]);
            } else break;
        }

        int sales = zj_num * zj_price + xsq_num * xsq_price + ws_num * ws_price;
        double reward;
        if (sales <= 1000) reward = sales * 0.1;
        else if (sales <= 1800) reward = sales * 0.15;
        else reward = sales * 0.2;

        System.out.print(String.format("%.2f", reward));
    }
}

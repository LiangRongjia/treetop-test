
import java.util.Scanner;

/**
 * @Author LHGRylynn
 * @Date 2021/5/9 19:59
 * @Description 6 - Automatic Billing System.
 */
public class main {
    public static void main(String[] args) {
        double basic_charge = 25;
        double fee_per_min = 0.15;

        double phone_time;
        int missed_payments;

        Scanner scan = new Scanner(System.in);

        String record = scan.nextLine();
        phone_time = Double.parseDouble(record.split(" ")[0]);
        missed_payments = Integer.parseInt(record.split(" ")[1]);

        if (condition(phone_time, missed_payments)) {
            calculatedFee(phone_time, missed_payments, basic_charge, fee_per_min);
        }
    }

    public static boolean condition(double phone_time, int missed_payments) {
        if (phone_time < 0) {
            System.out.print("phone times<0");
            return false;
        }
        if (missed_payments < 0) {
            System.out.print("number of unpaid payments<0");
            return false;
        }
        if (phone_time > 44640) {
            System.out.print("phone times over-limited");
            return false;
        }
        if (missed_payments > 11) {
            System.out.print("number of unpaid payments over-limited");
            return false;
        }
        return true;
    }

    public static void calculatedFee(double phone_time, int missed_payments, double basic_charge, double fee_per_min) {
        double fee;
        if (phone_time <= 60 && 0 <= phone_time && missed_payments <= 1)
            fee = basic_charge + fee_per_min * phone_time * (1 - 0.01);
        else if (phone_time <= 120 && 60 < phone_time && missed_payments <= 2)
            fee = basic_charge + fee_per_min * phone_time * (1 - 0.015);
        else if (phone_time <= 180 && 120 < phone_time && missed_payments <= 3)
            fee = basic_charge + fee_per_min * phone_time * (1 - 0.02);
        else if (phone_time <= 300 && 180 < phone_time && missed_payments <= 3)
            fee = basic_charge + fee_per_min * phone_time * (1 - 0.025);
        else if (300 < phone_time && missed_payments <= 6) fee = basic_charge + fee_per_min * phone_time * (1 - 0.03);
        else fee = basic_charge + fee_per_min * phone_time;

        System.out.print(String.format("%.2f", fee));

    }
}






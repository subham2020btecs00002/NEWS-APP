import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

public class SecretKeyGenerator {
    public static void main(String[] args) {
        try {
            // Create a KeyGenerator for HMAC with SHA-256
            KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
            keyGen.init(256); // Key size for HMAC should be at least 256 bits

            // Generate the secret key
            SecretKey secretKey = keyGen.generateKey();

            // Print the key in Base64 format
            System.out.println("Secret Key: " + java.util.Base64.getEncoder().encodeToString(secretKey.getEncoded()));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

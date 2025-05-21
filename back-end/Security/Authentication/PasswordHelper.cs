using System.Security.Cryptography;

namespace Jattac.Apps.CompanyMan.Security.Authentication
{
    public interface IPasswordHelper
    {
        string HashPassword(string password);

        bool VerifyPassword(string enteredPassword, string storedHash);
    }
    public class PasswordHelper : IPasswordHelper
    {


        // Main method to hash a password and store both the salt and hash
        public string HashPassword(string password)
        {
            byte[] salt = GenerateSalt();  // Generate a salt
            byte[] hash = HashPasswordWithSalt(password, salt);  // Hash the password with the salt

            // Combine the salt and hash for storage
            byte[] hashBytes = new byte[salt.Length + hash.Length];
            Array.Copy(salt, 0, hashBytes, 0, salt.Length);
            Array.Copy(hash, 0, hashBytes, salt.Length, hash.Length);

            return Convert.ToBase64String(hashBytes);  // Store as Base64 string
        }

        // Main method to verify the password
        public bool VerifyPassword(string enteredPassword, string storedHash)
        {
            byte[] hashBytes = Convert.FromBase64String(storedHash);

            // Extract the salt (first 16 bytes)
            byte[] salt = new byte[16];
            Array.Copy(hashBytes, 0, salt, 0, 16);

            // Hash the entered password with the extracted salt
            byte[] enteredHash = HashPasswordWithSalt(enteredPassword, salt);

            // Extract the stored hash (the last 20 bytes)
            byte[] storedHashBytes = new byte[20];
            Array.Copy(hashBytes, 16, storedHashBytes, 0, 20);

            // Compare the entered hash with the stored hash
            return CompareHashes(storedHashBytes, enteredHash);
        }

        // Helper to generate a salt
        private byte[] GenerateSalt(int size = 16)
        {
            byte[] salt = new byte[size];
            RandomNumberGenerator.Fill(salt);
            return salt;
        }

        // Helper to hash a password with a salt and specified iterations
        private byte[] HashPasswordWithSalt(string password, byte[] salt, int iterations = 100000)
        {
            using (var pbkdf2 = new Rfc2898DeriveBytes(password, salt, iterations, HashAlgorithmName.SHA256))
            {
                return pbkdf2.GetBytes(20);
            }
        }

        // Helper to compare hashes using constant-time comparison
        private bool CompareHashes(byte[] hash1, byte[] hash2)
        {
            return CryptographicOperations.FixedTimeEquals(hash1, hash2);
        }
    }
}
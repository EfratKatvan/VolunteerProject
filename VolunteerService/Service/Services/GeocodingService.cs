using System;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace Service.Helpers
{
    public static class GeocodingService
    {
        public static async Task<(double lat, double lon)> GetCoordinates(string street, string city)
        {
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("User-Agent", "MyVolunteerApp");
                string address = $"{street}, {city}, Israel";
                string url = $"https://nominatim.openstreetmap.org/search?q={Uri.EscapeDataString(address)}&format=json&limit=1";

                var response = await client.GetAsync(url);
                if (!response.IsSuccessStatusCode) return (0, 0);

                var json = await response.Content.ReadAsStringAsync();
                var data = JArray.Parse(json);

                if (data.Count > 0)
                {
                    double lat = double.Parse(data[0]["lat"].ToString());
                    double lon = double.Parse(data[0]["lon"].ToString());
                    return (lat, lon);
                }
            }
            return (0, 0);
        }
    }
}

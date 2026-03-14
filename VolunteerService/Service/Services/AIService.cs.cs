using Newtonsoft.Json;
using System.Text;

public class AIService
{
    private static readonly HttpClient _client = new HttpClient();

    public async Task<(string category, string icon, string status)> GetCategoryFromAI(string requestText)
    {
        var data = new { text = requestText };
        var json = JsonConvert.SerializeObject(data);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _client.PostAsync("http://127.0.0.1:8000/classify", content);

        var result = await response.Content.ReadAsStringAsync();
        dynamic obj = JsonConvert.DeserializeObject(result);

        return (
            (string)obj.category,
            (string)obj.icon,
            (string)obj.status
        );
    }
}





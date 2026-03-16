//using Repository.Entities;
//using Repository.Interfaces;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Net.Http;
//using System.Threading.Tasks;
//using Newtonsoft.Json.Linq; // דורש התקנת חבילת Newtonsoft.Json

//namespace Service.Services
//{
//    public class MatchingService
//    {
//        private readonly IRepository<HelpRequests> _helpRequestRepo;
//        private readonly IRepository<Users> _userRepo;
//        private readonly IRepository<Assignments> _assignmentRepo;
//        private readonly HttpClient _httpClient;
//        private const string GoogleApiKey = "YOUR_API_KEY_HERE";

//        public MatchingService(IRepository<HelpRequests> helpRequestRepo, IRepository<Users> userRepo, IRepository<Assignments> assignmentRepo)
//        {
//            _helpRequestRepo = helpRequestRepo;
//            _userRepo = userRepo;
//            _assignmentRepo = assignmentRepo;
//            _httpClient = new HttpClient();
//        }

//        public async Task<int> RunDailyMatchingAsync()
//        {
//            int matchCount = 0;
//            var allRequests = await _helpRequestRepo.GetAll();
//            var openRequests = allRequests.Where(r => r.Status == HelpRequestStatus.Open).ToList();
//            var allUsers = await _userRepo.GetAll();
//            var volunteers = allUsers.Where(u => u.UserRole == UserRole.Volunteer).ToList();

//            foreach (var request in openRequests)
//            {
//                var needyUser = allUsers.FirstOrDefault(u => u.Id == request.NeedyID);
//                if (needyUser == null) continue;

//                // 1. סינון ראשוני
//                var potentialVolunteers = volunteers.Where(v =>
//                    v.UserCategories.Any(uc => uc.CategoryID == request.CategoryID) &&
//                    v.Availabilities.Any(a =>
//                        a.Availability.Day == request.Availability.Day &&
//                        a.Availability.From_Time <= request.Availability.From_Time &&
//                        a.Availability.To_Time >= request.Availability.To_Time)
//                ).ToList();

//                // 2. מציאת המתנדב הכי קרוב (מתוך המסוננים)
//                Users bestVolunteer = null;
//                double minDistance = double.MaxValue;

//                foreach (var v in potentialVolunteers)
//                {
//                    double dist = await GetDistanceInKm(v.Adress, needyUser.Adress);
//                    if (dist < minDistance)
//                    {
//                        minDistance = dist;
//                        bestVolunteer = v;
//                    }
//                }

//                // 3. שידוך
//                if (bestVolunteer != null)
//                {
//                    await _assignmentRepo.AddItem(new Assignments
//                    {
//                        VolunteerID = bestVolunteer.Id,
//                        HelpRequestID = request.Id,
//                        AssignedAt = DateTime.Now,
//                        Status = AssignmentStatus.Active
//                    });

//                    request.Status = HelpRequestStatus.Matched;
//                    await _helpRequestRepo.UpdateItem(request.Id, request);
//                    matchCount++;
//                }
//            }
//            return matchCount;
//        }

//        private async Task<double> GetDistanceInKm(string addr1, string addr2)
//        {
//            string url = $"https://maps.googleapis.com/maps/api/distancematrix/json?origins={addr1}&destinations={addr2}&key={GoogleApiKey}";
//            var response = await _httpClient.GetStringAsync(url);
//            var json = JObject.Parse(response);
//            // חילוץ המרחק בקילומטרים מה-JSON של גוגל
//            var text = json["rows"][0]["elements"][0]["distance"]["text"].ToString();
//            return double.Parse(text.Replace(" km", ""));
//        }
//    }
//}

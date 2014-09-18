using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace XiaoBazaar.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public ActionResult Features()
        {
            ViewBag.Message = "Your features page.";

            return View();
        }

        public ActionResult Showcase()
        {
            ViewBag.Message = "Your showcase page.";

            return View();
        }

        public ActionResult Pricing()
        {
            ViewBag.Message = "Your pricing page.";

            return View();
        }
       
        public ActionResult Market_Place()
        {
            ViewBag.Message = "Your market place page.";

            return View();
        }
    }
}
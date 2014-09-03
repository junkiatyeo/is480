using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(XiaoBazaar.Startup))]
namespace XiaoBazaar
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}

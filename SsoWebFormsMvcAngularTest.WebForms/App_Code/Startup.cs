using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(SsoWebFormsMvcAngularTest.WebForms.Startup))]
namespace SsoWebFormsMvcAngularTest.WebForms
{
    public partial class Startup {
        public void Configuration(IAppBuilder app) {
            ConfigureAuth(app);
        }
    }
}

using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;

namespace RomanHuntWebsite.Server
{
	public class GeneralOutputFormatter : OutputFormatter
	{
		private JsonSerializer _camelCaseSerializer = new JsonSerializer()
		{
			ContractResolver = new DefaultContractResolver()
			{
				NamingStrategy = new CamelCaseNamingStrategy(),
			},
		};

		public GeneralOutputFormatter()
		{
			this.SupportedMediaTypes.Clear();
			this.SupportedMediaTypes.Add(MediaTypeHeaderValue.Parse(
				System.Net.Mime.MediaTypeNames.Application.Json));
		}

		public override async Task WriteResponseBodyAsync(OutputFormatterWriteContext context)
		{
			var jobj = JObject.FromObject(context.Object!, _camelCaseSerializer);
            string json = jobj.ToString(Formatting.None);
            await context.HttpContext.Response.WriteAsync(json);
		}
	}
}

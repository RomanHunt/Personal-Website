using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.EntityFrameworkCore;
using Resend;
using RomanHuntWebsite.Server;
using RomanHuntWebsite.Server.Data;
using System.Reflection;
using TypeGen.Core.Generator;

// CRITICAL FIX FOR CLIENT STARTUP: Allow MSBuild to trigger generation without launching the web app
if (args.Contains("--typegen"))
{
    try
    {
        Console.WriteLine("Executing MSBuild TypeGen file sync...");
        var generator = new Generator();
        string targetDir = "../RomanHuntWebsite.Client/src/app/shared/models";

        if (System.IO.Directory.Exists(targetDir))
        {
            System.IO.Directory.Delete(targetDir, true);
        }
        System.IO.Directory.CreateDirectory(targetDir);

        generator.Options.BaseOutputDirectory = targetDir;
        generator.Generate(Assembly.GetExecutingAssembly());

        // Consolidation Logic
        string consolidatedFilePath = System.IO.Path.Combine(targetDir, "models.ts");
        var consolidatedContent = new System.Text.StringBuilder();
        var generatedFiles = System.IO.Directory.GetFiles(targetDir, "*.ts").Where(f => !f.EndsWith("models.ts"));

        foreach (var file in generatedFiles)
        {
            string fileContent = System.IO.File.ReadAllText(file);
            var cleanLines = fileContent.Split(new[] { "\r\n", "\r", "\n" }, StringSplitOptions.None)
                .Where(line => !line.Trim().StartsWith("import "));

            consolidatedContent.AppendLine(string.Join(Environment.NewLine, cleanLines));
            consolidatedContent.AppendLine();
            System.IO.File.Delete(file);
        }

        System.IO.File.WriteAllText(consolidatedFilePath, consolidatedContent.ToString());
        Console.WriteLine("TypeGen consolidation completed successfully.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"TypeGen error: {ex.Message}");
    }

    // Terminate immediately so it doesn't try to build the WebApplication container
    return;
}

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenLocalhost(57529, listenOptions => listenOptions.UseHttps());
});

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("ProductionFrontend", policy =>
    {
        policy
            .WithOrigins("https://www.romannhunt.com")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 1. Get the connection string from appsettings.json

builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
    .AddJsonFile("appsettings.local.json", optional: true, reloadOnChange: true) // <-- Add this line last
    .AddEnvironmentVariables();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// 2. Register AppDbContext with MySQL provider and auto-detect server version
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddScoped<BaseManager>();

builder.Services.AddControllers(options =>
{
    options.OutputFormatters.Add(new GeneralOutputFormatter());
})
.AddNewtonsoftJson(options =>
   {
       // Force Newtonsoft to recognize unassigned DateTimes as UTC and append 'Z'
       options.SerializerSettings.DateTimeZoneHandling = Newtonsoft.Json.DateTimeZoneHandling.Utc;
   });
builder.Services.AddScoped<IBaseManager, BaseManager>();

// Configure Resend

builder.Services.AddOptions();

builder.Services.AddHttpClient<ResendClient>();

builder.Services.Configure<ResendClientOptions>(options =>
{
    options.ApiToken =
        builder.Configuration["Resend:ApiKey"]
        ?? throw new InvalidOperationException(
            "Resend API key is not configured.");
});

builder.Services.AddTransient<IResend, ResendClient>();




var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("ProductionFrontend");

app.UseAuthorization();

app.MapControllers();


app.MapFallbackToFile("/index.html");

/*
// --- FIXED TYPEGEN AUTO-GENERATION & CONSOLIDATION ---
if (app.Environment.IsDevelopment())
{
    try
    {
        Console.WriteLine("Executing programmatic TypeGen file sync...");

        var generator = new Generator();
        string targetDir = "../RomanHuntWebsite.Client/src/app/shared/models";

        // 1. Wipe and recreate the folder cleanly
        if (System.IO.Directory.Exists(targetDir))
        {
            System.IO.Directory.Delete(targetDir, true);
        }
        System.IO.Directory.CreateDirectory(targetDir);

        generator.Options.BaseOutputDirectory = targetDir;

        // 2. Generate the single-class-per-file types into the directory
        Assembly serverAssembly = Assembly.GetExecutingAssembly();
        generator.Generate(serverAssembly);

        // 3. CONSOLIDATION LOGIC: Merge all individual generated files into a single models.ts file
        string consolidatedFilePath = System.IO.Path.Combine(targetDir, "models.ts");
        var consolidatedContent = new System.Text.StringBuilder();

        // Find all generated .ts files, excluding any pre-existing models.ts
        var generatedFiles = System.IO.Directory.GetFiles(targetDir, "*.ts")
            .Where(f => !f.EndsWith("models.ts"));

        foreach (var file in generatedFiles)
        {
            string fileContent = System.IO.File.ReadAllText(file);

            // Remove local cross-file import lines generated by TypeGen 
            // (e.g., matching lines starting with "import {") since everything will be in one file.
            var cleanLines = fileContent.Split(new[] { "\r\n", "\r", "\n" }, StringSplitOptions.None)
                .Where(line => !line.Trim().StartsWith("import "));

            consolidatedContent.AppendLine(string.Join(Environment.NewLine, cleanLines));
            consolidatedContent.AppendLine(); // Add spacing between classes

            // Delete the individual file so only the consolidated one remains
            System.IO.File.Delete(file);
        }

        // Write out the singular consolidated models file
        System.IO.File.WriteAllText(consolidatedFilePath, consolidatedContent.ToString());

        Console.WriteLine("TypeGen sync and file consolidation completed successfully.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"TypeGen error: {ex.Message}");
    }
}
*/


app.Run();

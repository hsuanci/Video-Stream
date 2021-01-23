using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace back.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class VideoController : ControllerBase
    {
        [HttpGet("{fileName}")]
        public FileResult Get(string fileName)
        {
            return PhysicalFile($"{Directory.GetCurrentDirectory()}/wwwroot/video/{fileName}", "application/octet-stream", enableRangeProcessing: true);
        }

        [HttpPost]
        [RequestFormLimits(MultipartBodyLengthLimit = 100000000000000)]
        [RequestSizeLimit(100000000000000)]
        public async Task<IActionResult> Post(IFormFile file)
        {
            if (file.Length > 0)
            {
                var saveFilePath = $"{Directory.GetCurrentDirectory()}/wwwroot/video/{file.FileName}";

                using (var stream = System.IO.File.Create(saveFilePath))
                {
                    await file.CopyToAsync(stream);
                }

                return Ok(new
                {
                    VideoPath = $"https://localhost:5001/video/{file.FileName}"
                });
            }

            return NoContent();
        }
    }
}
